<?php
if($_SERVER['REQUEST_METHOD'] === 'POST'){
   $prodect = $_POST['prodect'];
   $database = $_POST['database'];
   $rett = $_POST['rett'];
   $newValue = substr($database, 0, -5);
   
   include 'DataBase/prodect.php';  // الاتصال بقاعدة البيانات

// حماية من الحقن SQL
$prodect  = mysqli_real_escape_string($conn, $prodect);
$newValue = mysqli_real_escape_string($conn, $newValue);
$rett     = (int)$rett;

// 1) جلب الصف المطلوب
$sqlSelect = "SELECT * FROM `$newValue` WHERE code = '$prodect' LIMIT 1";
$result = mysqli_query($conn, $sqlSelect);

if(mysqli_num_rows($result) == 0){
    die("المنتج غير موجود");
}

$row = mysqli_fetch_assoc($result);

// 2) حساب القيم الجديدة
$newRating = $row['rating'] + $rett;   // إضافة التقييم
$newViews  = $row['views'] + 1;        // إضافة زيارة واحدة

// 3) تحديث الصف
$sqlUpdate = "UPDATE `$newValue` 
             SET rating = '$newRating',
                 views = '$newViews'
             WHERE code = '$prodect'";

if(mysqli_query($conn, $sqlUpdate)){
    echo "تم اضافة التقييم بنجاح";
    include 'API_create.php';
}else{
    echo "حدث خطأ: " . mysqli_error($conn);
}


   
}
?>