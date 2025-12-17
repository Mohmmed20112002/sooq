<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $url = $_POST['link'] ?? '';

    // تحقق من الرابط، يجب أن يكون URL صالح أو ملف HTML داخل المشروع
    if (!empty($url)) {
        // جلب محتوى الصفحة كنص فقط (لن ينفذ PHP)
        $content = file_get_contents($url);

        if ($content !== false) {
            // عرض المحتوى داخل الصفحة الحالية
            echo $content;
        } else {
            echo "❌ لم أتمكن من جلب المحتوى.";
        }
    }
}
?>
