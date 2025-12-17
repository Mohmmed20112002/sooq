<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$file_name = $_GET['id_seller_file'] ?? "";
$file_path = __DIR__ . '/uploads/' . $file_name ?? "";

$user_name     = $_GET['user_name'];
$user_email    = $_GET['user_email'];
$password      = $_GET['password'];
$account_type  = $_GET['account_type'];
$phone         = $_GET['phone'];
$activet       = "not_active";
// إنشاء رقم عشوائي مكون من 16 رقم
$digits = '';
for ($i = 0; $i < 16; $i++) {
    $digits .= random_int(0, 9);
}
$random16 = $digits;

if($account_type === "seller"){
    include 'DataBase/sale.php';
    $sql = "INSERT INTO sales (name, email, password, phone, code, id_seller, activet)
            VALUES ('$user_name', '$user_email', '$password', '$phone', '$random16' , '$file_name', '$activet')";
    
    if ($conn->query($sql) === TRUE) {
      include 'API_sale.php';
      header("Location: ../login.html"); 
    } else {
        echo "حدث خطأ أثناء التسجيل: " . $conn->error;
    }

    $conn->close();

}elseif($account_type === "freelanser"){
    include 'DataBase/freelanser_db.php';
    $sql = "INSERT INTO freelancers (name, email, password, phone, code)
            VALUES ('$user_name', '$user_email', '$password', '$phone', '$random16')";
    
    if ($conn->query($sql) === TRUE) {
     include 'API_freelanser.php';
     header("Location: ../login.html"); 

    } else {
        echo "حدث خطأ أثناء التسجيل: " . $conn->error;
    }

    $conn->close();
}
?>
