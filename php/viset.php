<?php
include 'DataBase/home_db.php';
if($_SERVER['REQUEST_METHOD']=== 'POST'){
    $user = $_POST['user'];
$conn = new mysqli("localhost", "root", "", "home");

// التحقق من الاتصال
if ($conn->connect_error) {
    die("فشل الاتصال: " . $conn->connect_error);
}

// استدعاء القيمة الحالية من العمود visits للصف id = 1
$result = $conn->query("SELECT visits FROM home WHERE id = 1");

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $current_visits = $row['visits'];
    
    // زيادة القيمة بمقدار 1
    $new_visits = $current_visits + $user;
    
    // تحديث القيمة في الجدول
    $update = $conn->query("UPDATE home SET visits = $new_visits WHERE id = 1");
    
    if ($update) {
       include 'API_home.php';
    } else {
        echo "حدث خطأ أثناء التحديث: " . $conn->error;
    }
} else {
    echo "الصف غير موجود.";
}

$conn->close();
}
?>