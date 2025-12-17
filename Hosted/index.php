<?php
$result = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $domain = $_POST['domain'] ?? '';
    $domain = trim($domain);

    if (!empty($domain)) {
        // التأكد من صحة الدومين
        if (!filter_var('http://' . $domain, FILTER_VALIDATE_URL)) {
            $result = ['error' => 'الرابط غير صالح'];
        } else {
            // تحويل الدومين إلى IP
            $ip = gethostbyname($domain);

            // استخدام IPWHO API
            $url = "https://ipwho.is/{$ip}";
            $json = file_get_contents($url);
            $data = json_decode($json, true);

            if ($data && isset($data['success']) && $data['success'] == true) {
                $result = $data;
            } else {
                $result = ['error' => 'لم يتم العثور على معلومات الاستضافة'];
            }
        }
    } else {
        $result = ['error' => 'الرجاء إدخال رابط الموقع'];
    }
}
?>

<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <title>Sooq Code</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet">
    <link rel="icon" type="png" href="image/login_image/logo.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-…" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
      <header>
     <nav class="nav">
    <h1 class="logo"><a href="#">Sooq Code</a></h1>

    <ul id="navList">
        <li id="li_1">الرئيسيه</li>
        <li id="li_2">
            <select id="app">
                <option value="">تطبيقات</option>
                <option value="appliction">تطبيقات فعليه</option>
                <option value="code_app">اكواد تطبيقات</option>
            </select>
        </li>
        <li id="li_3">
            <select id="web">
                <option value="">مواقع</option>
                <option value="web_them">قوالب مواقع</option>
                <option value="web_side">مواقع فعليه</option>
            </select>
        </li>
        <li id="li_4"><a href="#request_info">اطلب خدمه</a></li>
        <li id="li_5"><a href="#services">خدماتنا</a></li>
        <li id="li_6"><a href="#contact">تواصل معنا</a></li>
        <li><a href="http://localhost/web_stor/blog.html">المدونه</a></li>
        <li class="sin"><button class="login">تسجيل الدخول</button></li>
    </ul>

    <div class="burger">
        <i class="fa-solid fa-list"></i>
    </div>
</nav>
   </header> 

    <div class="container">
        <h1>فحص استضافة أي موقع</h1>
        <form method="post">
            <input type="text" name="domain" placeholder="ادخل رابط الموقع" required>
            <button type="submit">تحقق</button>
        </form>

        <?php if ($result): ?>
            <div class="result">
                <?php if (isset($result['error'])): ?>
                    <p class="error"><?= htmlspecialchars($result['error']) ?></p>
                <?php else: ?>
                    <p><strong>الدومين:</strong> <?= htmlspecialchars($domain) ?></p>
                    <p><strong>IP السيرفر:</strong> <?= htmlspecialchars($result['ip'] ?? 'غير معروف') ?></p>
                    <p><strong>مزود الخدمة:</strong> <?= htmlspecialchars($result['connection']['isp'] ?? 'غير معروف') ?></p>
                    <p><strong>المدينة:</strong> <?= htmlspecialchars($result['city'] ?? 'غير معروف') ?></p>
                    <p><strong>المنطقة:</strong> <?= htmlspecialchars($result['region'] ?? 'غير معروف') ?></p>
                    <p><strong>الدولة:</strong> <?= htmlspecialchars($result['country'] ?? 'غير معروف') ?></p>
                    <p><strong>رمز الدولة:</strong> <?= htmlspecialchars($result['country_code'] ?? 'غير معروف') ?></p>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>
<script src="script.js"></script>
</body>
</html>
