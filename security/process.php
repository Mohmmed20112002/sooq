<?php
// process.php

// Helper: تنظيف الدومين وإزالة المسار، البروتوكول، و www.
function normalize_domain($input) {
    $input = trim($input);
    // إن أدخل المستخدم URL كامل، نأخذ المضيف فقط
    if (strpos($input, '://') !== false) {
        $parts = parse_url($input);
        $host = $parts['host'] ?? $input;
    } else {
        // قد يحتوي على مسار بعد المضيف
        $input = preg_replace('#^www\.#', '', $input);
        $host = explode('/', $input)[0];
    }
    // إزالة أي port
    $host = preg_replace('/:\d+$/', '', $host);
    return strtolower($host);
}

// Helper: استخدام cURL لمتابعة Redirects والحصول على الـ effective URL وHTTP code
function curl_fetch_info($url, &$effective_url = null, &$http_code = null, $timeout = 10) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_HEADER => true,
        // لا نستخدم VERIFY في البيئة المحلية لمنع فشلات غير ضرورية
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
    ]);
    $resp = curl_exec($ch);
    if ($resp === false) {
        $err = curl_error($ch);
        curl_close($ch);
        return ['error' => $err];
    }
    $effective_url = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['raw' => $resp];
}

// Helper: طلب بيانات IP/ASN من ipwho.is
function get_ip_info($ip) {
    $api = "https://ipwho.is/{$ip}";
    $json = @file_get_contents($api);
    if (!$json) return null;
    $data = json_decode($json, true);
    return $data;
}

// Helper: طلب SSL Labs analyze و poll حتى READY أو timeout
function get_ssl_grade($host, $max_seconds = 60) {
    $host_enc = urlencode($host);
    $start = time();
    // ارسل الطلب الأول مع startNew=on لتجهيز التحليل
    $api = "https://api.ssllabs.com/api/v3/analyze?host={$host_enc}&all=done&fromCache=on";
    $json = @file_get_contents($api);
    if ($json === false) {
        // حاول بدون fromCache
        $api = "https://api.ssllabs.com/api/v3/analyze?host={$host_enc}&all=done";
        $json = @file_get_contents($api);
        if ($json === false) return 'غير معروف';
    }
    $data = json_decode($json, true);
    if (!$data) return 'غير معروف';

    // إذا الحالة ليست READY، نعمل polling
    while (isset($data['status']) && $data['status'] !== 'READY') {
        // حالات ممكنة: DNS, IN_PROGRESS, ERROR
        if ($data['status'] === 'ERROR') {
            return 'غير معروف';
        }
        if ((time() - $start) > $max_seconds) {
            return 'قيد الانتظار'; // تجاوز الوقت المسموح
        }
        // انتظر قليلاً ثم اطلب مرة أخرى
        sleep(3);
        $api2 = "https://api.ssllabs.com/api/v3/analyze?host={$host_enc}&all=done&fromCache=on";
        $json = @file_get_contents($api2);
        if ($json === false) break;
        $data = json_decode($json, true);
        if (!$data) break;
    }

    // الآن اذا جاهز، اقرأ الـ grade من endpoint الأول (قد يكون أكثر من endpoint)
    if (isset($data['endpoints']) && is_array($data['endpoints']) && count($data['endpoints'])>0) {
        // الجمع بين جميع endpoints إن رغبت - هنا نأخذ أول endpoint grade
        $grades = [];
        foreach ($data['endpoints'] as $ep) {
            if (isset($ep['grade'])) $grades[] = $ep['grade'];
        }
        // لو كانت متعددة نعرض الأولى أو نعرض المجموعة
        if (!empty($grades)) {
            // إذا كل النقاط متشابهة نعيد نفس، وإلا نعرض الأولى مع الإشارة إلى وجود أكثر من نتيجة
            $unique = array_values(array_unique($grades));
            if (count($unique) === 1) return $unique[0];
            return implode(', ', $unique);
        }
    }

    return 'غير معروف';
}

// تصنيف مستوى الأمان
function classify_security($https_used, $ssl_grade) {
    if (!$https_used) return ['ضعيف', 'weak'];
    if ($ssl_grade === 'قيد الانتظار') return ['متوسط', 'medium'];
    $mapGood = ['A+', 'A'];
    $mapMedium = ['A-', 'B'];
    if (in_array($ssl_grade, $mapGood)) return ['آمن', 'safe'];
    if (in_array($ssl_grade, $mapMedium)) return ['متوسط', 'medium'];
    return ['غير معروف', 'gray'];
}

// بداية المعالجة
$raw = $_POST['domain'] ?? '';
$raw = trim($raw);
if ($raw === '') {
    echo '<div class="info">الرجاء إدخال رابط الموقع.</div>';
    exit;
}

$domain = normalize_domain($raw);

// تحقق بسيط إن النطاق يبدو صالحاً
if (!filter_var('http://'.$domain, FILTER_VALIDATE_URL)) {
    echo '<div class="info">الرابط المدخل يبدو غير صالح. تأكد من إدخال دومين صحيح مثل example.com</div>';
    exit;
}

// 1) تتبع إعادة التوجيه والحصول على الـ effective URL وHTTP status (نستخدم http أولاً)
$effective = null;
$http_code = null;
$res = curl_fetch_info("http://{$domain}", $effective, $http_code, 15);
if (isset($res['error'])) {
    // حاول https مباشرة
    $res2 = curl_fetch_info("https://{$domain}", $effective, $http_code, 15);
    if (isset($res2['error'])) {
        echo '<div class="info">تعذر الوصول إلى النطاق عبر HTTP/HTTPS: '.htmlspecialchars($res['error'] ?? $res2['error']).'</div>';
        exit;
    }
}

// إذا effective URL غير فارغ، نستخدم scheme منه لتحديد استخدام HTTPS الحقيقي
$effective_scheme = 'http';
if ($effective) {
    $p = parse_url($effective);
    if (isset($p['scheme'])) $effective_scheme = strtolower($p['scheme']);
}

// نعتبر الموقع يستخدم HTTPS إذا كانت الخطة النهائية https
$https_used = ($effective_scheme === 'https');

// 2) الحصول على IP من الـ domain (قد يرجع IPv4 أو IPv6)
$ip = gethostbyname($domain);
if ($ip === $domain) {
    // قد لا تم حلّ الـ DNS
    $ip = 'غير معروف';
}

// 3) طلب بيانات IP/ASN (مزود الاستضافة المحتمل)
$ip_info = ($ip !== 'غير معروف') ? get_ip_info($ip) : null;
$isp = 'غير معروف';
$org = 'غير معروف';
if (is_array($ip_info)) {
    $isp = $ip_info['connection']['isp'] ?? ($ip_info['isp'] ?? 'غير معروف');
    // ipwho.is قد يعطي org أو connection.org أو asn
    if (isset($ip_info['asn'])) {
        $org = $ip_info['asn']['name'] ?? $ip_info['connection']['org'] ?? $ip_info['org'] ?? 'غير معروف';
    } else {
        $org = $ip_info['connection']['org'] ?? $ip_info['org'] ?? 'غير معروف';
    }
}

// 4) Nameservers (آمن مع suppression وتحويل للأخطاء)
$ns_records = @dns_get_record($domain, DNS_NS);
$nameservers = [];
if ($ns_records && is_array($ns_records)) {
    foreach ($ns_records as $ns) {
        if (isset($ns['target'])) $nameservers[] = $ns['target'];
    }
}
if (empty($nameservers)) $nameservers = ['غير معروف'];

// 5) SSL Grade عبر SSL Labs (إذا يستخدم HTTPS)
$ssl_grade = 'غير متوفر';
if ($https_used) {
    // هنا نعطي مهلة 60 ثانية كحد أقصى لجلب نتيجة SSL Labs
    $ssl_grade = get_ssl_grade($domain, 60);
}

// 6) تصنيف الأمان
list($security_label, $security_class) = classify_security($https_used, $ssl_grade);

// 7) محاولة تحديد مزود الاستضافة بدقة أكبر باستخدام org/isp/nameservers
$hosting_provider = 'غير معروف';
$candidates = [
    'cloudflare' => 'Cloudflare',
    'amazon' => 'Amazon (AWS)',
    'amazonaws' => 'Amazon (AWS)',
    'google' => 'Google Cloud',
    'googleusercontent' => 'Google Cloud',
    'akamai' => 'Akamai',
    'facebook' => 'Meta / Facebook',
    'microsoft' => 'Microsoft (Azure)',
    'digitalocean' => 'DigitalOcean',
    'ovh' => 'OVH',
    'namecheap' => 'Namecheap',
    'godaddy' => 'GoDaddy',
    'bluehost' => 'Bluehost',
    'siteground' => 'SiteGround',
    'hostgator' => 'HostGator'
];
// تحقق من org و isp و nameservers
$hay = strtolower($org . ' ' . $isp . ' ' . implode(' ', $nameservers));
foreach ($candidates as $key => $name) {
    if (stripos($hay, $key) !== false) {
        $hosting_provider = $name;
        break;
    }
}

// 8) عرض النتائج كـ HTML (مناسب للعرض داخل الصفحة عبر AJAX)
echo '<table class="table">';
echo '<tr><th>العنصر</th><th>القيمة</th></tr>';
echo '<tr><td>الدومين (المدخل)</td><td>'.htmlspecialchars($raw).'</td></tr>';
echo '<tr><td>النطاق العادي</td><td>'.htmlspecialchars($domain).'</td></tr>';
echo '<tr><td>الرابط النهائي بعد التوجيه</td><td>'.htmlspecialchars($effective ?? 'غير معروف').'</td></tr>';
echo '<tr><td>IP السيرفر</td><td>'.htmlspecialchars($ip).'</td></tr>';
echo '<tr><td>يستخدم HTTPS</td><td>'.($https_used ? 'نعم' : 'لا').'</td></tr>';
echo '<tr><td>حالة HTTP</td><td>'.htmlspecialchars($http_code ?? 'غير معروف').'</td></tr>';
echo '<tr><td>مزود الشبكة (ISP)</td><td>'.htmlspecialchars($isp).'</td></tr>';
echo '<tr><td>منظمة/ASN (اتحاد الشبكة)</td><td>'.htmlspecialchars($org).'</td></tr>';
echo '<tr><td>Nameservers</td><td>'.htmlspecialchars(implode(', ', $nameservers)).'</td></tr>';
echo '<tr><td>مزود الاستضافة المحتمل</td><td>'.htmlspecialchars($hosting_provider).'</td></tr>';
echo '<tr><td>SSL Grade (SSL Labs)</td><td>'.htmlspecialchars($ssl_grade).'</td></tr>';
echo '<tr><td>مستوى الأمان العام</td><td><span class="badge '.htmlspecialchars($security_class).'">'.htmlspecialchars($security_label).'</span></td></tr>';
echo '</table>';

// ملاحظة صغيرة لشرح النتائج للمستخدم
echo '<div class="small">ملاحظات: قد يحتاج SSL Labs وقتاً لتحليل النطاقات الكبيرة؛ إن ظهر "قيد الانتظار" فحاول إعادة الفحص بعد ثوانٍ. نتائج "مزود الاستضافة المحتمل" هي تقديرية مبنية على معلومات ASN وNameservers.</div>';
