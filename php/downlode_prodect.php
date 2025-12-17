<?php
if($_SERVER['REQUEST_METHOD'] === 'POST'){
$table = $_POST['table'];
$item  = $_POST['item'];

include 'DataBase/prodect.php'; // الاتصال بقاعدة البيانات في المتغير $conn

// التحقق من اسم الجدول لحمايته من الحقن SQL Injection
$allowed_tables = ['web_them', 'web_side', 'app_code', 'appliction']; // ضع أسماء الجداول المسموحة هنا

if (!in_array($table, $allowed_tables)) {
    die("Invalid table name");
}

// تجهيز الاستعلام
$sql = "SELECT download_link FROM `$table` WHERE code = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $item);
$stmt->execute();

$result = $stmt->get_result();
$data   = $result->fetch_assoc();

if($data){
    echo $data['download_link'];
} else {
    echo "not_found";
}

$stmt->close();
$conn->close();

}
?>