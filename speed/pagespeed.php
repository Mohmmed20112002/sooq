<?php
// تعطيل عرض الأخطاء لمنع إرسال HTML بدلاً من JSON
error_reporting(0);
ini_set('display_errors', 0);
ini_set('output_buffering', 'on');
ob_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// معالجة OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// إعدادات API Key
// احصل على مفتاح API من: https://console.cloud.google.com/apis/credentials
// ثم أضفه هنا:
define('GOOGLE_API_KEY', 'AIzaSyDPACMaziJDm_o68vF5AYGGc3X5wl0jW7Q');

// التحقق من وجود API Key
$useApiKey = !empty(GOOGLE_API_KEY) && GOOGLE_API_KEY !== 'YOUR_API_KEY_HERE';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('خطأ في قراءة البيانات المرسلة');
        }
        
        $url = isset($input['url']) ? trim($input['url']) : '';
        $strategy = isset($input['strategy']) ? $input['strategy'] : 'mobile';
        
        // التحقق من صحة الرابط
        if (empty($url)) {
            throw new Exception('يرجى إدخال رابط الموقع');
        }
        
        // إضافة https:// إذا لم يكن موجوداً
        if (!preg_match('/^https?:\/\//', $url)) {
            $url = 'https://' . $url;
        }
        
        // التحقق من صحة الرابط
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            throw new Exception('رابط غير صحيح');
        }
        
        // التحقق من صحة الاستراتيجية
        if (!in_array($strategy, ['mobile', 'desktop'])) {
            $strategy = 'mobile';
        }
        if ($useApiKey) {
            // استخدام API Key (الطريقة الموصى بها)
            $apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
            $params = [
                'url' => $url,
                'strategy' => $strategy,
                'key' => GOOGLE_API_KEY,
                'category' => 'performance'
            ];
            
            $requestUrl = $apiUrl . '?' . http_build_query($params);
        } else {
            // استخدام الطريقة العامة بدون API Key (محدودة)
            // ملاحظة: هذه الطريقة قد لا تعمل دائماً بسبب قيود Google
            $apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
            $params = [
                'url' => $url,
                'strategy' => $strategy,
                'category' => 'performance'
            ];
            
            $requestUrl = $apiUrl . '?' . http_build_query($params);
        }
        
        // إعداد cURL
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $requestUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 120); // زيادة الوقت إلى 120 ثانية
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        
        if ($curlError) {
            throw new Exception('خطأ في الاتصال: ' . $curlError);
        }
        
        if (empty($response)) {
            throw new Exception('الاستجابة فارغة من Google API. يرجى المحاولة مرة أخرى.');
        }
        
        if ($httpCode !== 200) {
            $errorData = json_decode($response, true);
            $errorMessage = 'خطأ من API';
            
            if (isset($errorData['error']['message'])) {
                $errorMessage = $errorData['error']['message'];
            } elseif ($httpCode === 429) {
                $errorMessage = 'تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً أو استخدام API Key';
            } elseif ($httpCode === 400) {
                $errorMessage = 'رابط غير صحيح أو غير قابل للوصول';
            } elseif ($httpCode === 403) {
                $errorMessage = 'تم رفض الوصول. يرجى التحقق من صحة API Key';
            }
            
            throw new Exception($errorMessage . ' (كود الخطأ: ' . $httpCode . ')');
        }
        
        $data = json_decode($response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('خطأ في تحليل البيانات المستلمة: ' . json_last_error_msg());
        }
        
        if (!isset($data['lighthouseResult'])) {
            throw new Exception('لم يتم العثور على نتائج التحليل في الاستجابة');
        }
        
        ob_clean();
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
        
    } catch (Exception $e) {
        ob_clean();
        http_response_code(400);
        echo json_encode([
            'error' => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit;
    } catch (Throwable $e) {
        ob_clean();
        http_response_code(500);
        echo json_encode([
            'error' => 'حدث خطأ غير متوقع: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
} else {
    ob_clean();
    http_response_code(405);
    echo json_encode(['error' => 'طريقة الطلب غير مدعومة'], JSON_UNESCAPED_UNICODE);
    exit;
}
?>

