<?php
$host = "localhost";   // اسم السيرفر (غالبًا localhost)
$user = "root";        // اسم المستخدم في MySQL
$pass = "";            // كلمة المرور (افتراضيًا فارغة في XAMPP)
$dbname = "social"; // اسم قاعدة البيانات

// إنشاء الاتصال
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("فشل الاتصال بقاعدة البيانات: " . $conn->connect_error);
}
?>