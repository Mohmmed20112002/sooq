<?php
$prodect_name  = $_POST['prodect_name']  ?? '';//اسم المنتج1
$prodect_code = $_POST['prodect_code'] ?? ''; //كود المنتج

$description   = $_POST['description']   ?? '';//الوصف2
$prodect_price = $_POST['prodect_price'] ?? '';//السعر3
$type          = $_POST['type']          ?? '';//النوع
$tole          = $_POST['tole']          ?? '';//الادوا4ت المستخدمه
$view_page     = $_POST['view_page']     ?? '';//صفحة ال4ظهور
$prodect_type  = $_POST['prodect_type']  ?? '';//حالة الم6نتج نشط او غير نشط 
$view_link     = $_POST['view_link']  ?? '';// رابط المشاه7ده
$ification     = $_POST['ification'] ?? '';// التصنيف8
//===========================================================
// في حالة كان المنتج موقع فعلي
//===========================================================
$visity        = $_POST['visity'] ?? '';// الزيارات الشهريه
$monthly       = $_POST['monthly'] ?? '';//الارباح الشهريه
//==========================================================
//في حالة كان المنتج كود التطبيق 
//==========================================================
$operating_system =$_POST['operating_system'] ?? '';
//==========================================================
//في حالة كان المنتج تطبيق فعلي
//==========================================================
$downloads     = $_POST['downloads'] ?? '';
$monthly_earnings = $_POST['monthly_earnings'] ?? ''; 

$edit_type     = $_POST['edit_type'] ?? '';

if($edit_type == "edit"){
    if($type == "web_them"){
        include 'DataBase/prodect.php';

        $stmt = $conn->prepare("UPDATE web_them SET
            name = ?,
            description = ?,
            price = ?,
            technologies = ?,
            page_link = ?,
            ification = ?,
            view_link = ?,
            type = ?
            WHERE code = ?
            LIMIT 1
        ");

        // تمرير المتغيرات بالترتيب الصحيح
        $stmt->bind_param(
            "ssdssssss",
            $prodect_name,
            $description,
            $prodect_price,
            $tole,
            $view_page,
            $ification,
            $view_link,
            $prodect_type,
            $prodect_code
        );

        if($stmt->execute()){
          header("Location: API_webthem.php");
         };
        $stmt->close();
    }elseif($type == "web_side"){
        include 'DataBase/prodect.php';

        $stmt = $conn->prepare("UPDATE web_side SET
            name = ?,
            description = ?,
            price = ?,
            technologies = ?,
            page_link = ?,
            ification = ?,
            view_link = ?,
            type = ?,
            visits = ?,
            monthly_earnings = ?
            WHERE code = ?
            LIMIT 1
        ");

        // تمرير المتغيرات بالترتيب الصحيح
        $stmt->bind_param(
            "ssdssssssss",
            $prodect_name,
            $description,
            $prodect_price,
            $tole,
            $view_page,
            $ification,
            $view_link,
            $prodect_type,
            $visity,
            $monthly,
            $prodect_code
        );
        if($stmt->execute()){
          header("Location: API_webside.php");
         };

    }elseif($type == "app_code"){
          include 'DataBase/prodect.php';

        $stmt = $conn->prepare("UPDATE app_code SET
            name = ?,
            description = ?,
            price = ?,
            technologies = ?,
            page_link = ?,
            ification = ?,
            view_link = ?,
            type = ?,
            operating_system = ?
            WHERE code = ?
            LIMIT 1
        ");

        // تمرير المتغيرات بالترتيب الصحيح
        $stmt->bind_param(
            "ssdsssssss",
            $prodect_name,
            $description,
            $prodect_price,
            $tole,
            $view_page,
            $ification,
            $view_link,
            $prodect_type,
            $operating_system,
            $prodect_code
        );

        if($stmt->execute()){
          header("Location: API_app_code.php");
         };
        $stmt->close();
    }elseif($type == "appliction"){

include 'DataBase/prodect.php';

$stmt = $conn->prepare("UPDATE appliction SET
    name = ?,
    description = ?,
    price = ?,
    technologies = ?,
    page_link = ?,
    ification = ?,
    view_link = ?,
    type = ?,
    operating_system = ?,
    downloads = ?,
    monthly_earnings = ?
    WHERE code = ?
    LIMIT 1
");

$stmt->bind_param(
    "ssdsssssssss",
    $prodect_name,
    $description,
    $prodect_price,
    $tole,
    $view_page,
    $ification,
    $view_link,
    $prodect_type,
    $operating_system,
    $downloads,
    $monthly_earnings,
    $prodect_code
);

if ($stmt->execute()) {
header("Location: API_appliction.php");
$stmt->close();
$conn->close();


    }}
//حذف عنصر 
}elseif($edit_type == "delet"){
    $accessToken = "sl.u.AGFaAzZCmKtnZlZJrJzYHG4myikO-DUp6gTccp3jlfgxrM6KU0yjC8kdEVGVF2PlMecysWBmLjPcxFfxDmvdBbls1vIJcOdoibVRMI9IXw6rTCG2LCkZzlIP4hwYK3BmaBVSf1KgigegFuyI3xo_BE7mflc5-kyauK4Z8IwgxRQ3wZohXzJtu1fnnrf38MA4vQaynozdRUQu-vXBnIspRZJjSwPyk7lmt1JX9YqVQwV4RCPDdicyUrmfbgzHOT6msiTAzNnD-OqwTYVK32nc1s3NnyaDU-zDvQq2CphQ6galZNj14NV7HZ4XZzxJFGRI3OCB57yTh3OzfPTxdC7nfT4_WRLc7g3ta7pcIooUW11y4NB5KVDGdMDZY1zYGnBEgPnUOlrrdFD2TA3Y3PhfsCWKSn7YZdJ2EMUTYsH42F2Cq5Rp46TVxWS0YAyzfPyknypOzcOjoXdi1ipESVcMl1b7IvNWu2KCp615ClSDOUEAfC7zRXjp6KOlosbimBF6_aSoI-P7Fbc_hidEgiENB7jU_Qjok08At7_J-3k14mgbbFfdj17JsFyiEYThJ2eod4lYD-nFKwQ9agGtbHncHDfsgDuR91OTa7JE0saT7-LARv-gi3STizwdRdFJV0XoAgF6qdYLOjcZ_VD3smqdvtPqe0oiXRnTZujzO_ppaH141eM-qW-YE4yVEUOI4Bgxijq3RMpLsXScqF6UUZw0FYKI-v97Ej19pdd22O3xtSqwD2_ceMe8K1Wa6E9lQAEG7ykaTIPBVaoehUE5BQJOPcj42xMy5a81_Re5Mv04Vzg96IP0isj5Vr1ETysonz35RPFzKY63PtFV_ChrjzWBXgT1HyePre8BMlkESOzcXQ0YHDwhlgedSMg9-jYFB_Ka68JHEMt-T6jtUctyR0R4VtQKCI0xJnm5SzAltxCFzgwettYmhCbE3NVI2X5ym88joZ3d2mLpb7kUcirRqeNjLV3k9wfwCTTHnY_wHVEuYYP1lAROjZ6cZYzuR5sdrnOe3ui1p_aLIHOXL9ggNvXe7YPLe11wrJI-kfQ3K2wgrA6IOethOH8F1E-AKZvxF11dyI0TAR0HaNVc5JFQc6YxS65A8gb1wTiNHk4tA5OHwKxxo-EgP6bgVd7m_Op7CckMPWt9-uSRFOLoZoxZCaV_brRPnwWpRQY64LZksZSjrpObBFQd93Qm4iR3uyGmBvChVoJVQ5pH9AyXdpee_zPs2I_jfnauqsc_9uLPFU0B6tCmkdwsrr3nN9tZaHI9soBXd4m0vZ-Rp3pxFbUaJ8dqLEk5ZYRJpXWRBNEMnfwR9um0qgHsX9RubvflIQlDxrJGS8-EB5qC6Wv_W_dD3OF-lAXUtpWQ9hbkGajFMB3y4cI9pjNSc51ebpEADcH6l8SiqWpMIzoCEoBOisFXCShnLNl04JV2EVJuf02OW-6_tvkPDyWybuQW2yGK6OydNyJQ8fWCaxSOV0kR2JmRFFfZHnW8KDvWbjBEwLDfqTDm9LnMQ3iGuEn925gcKEQweXAl0Bt9lRJSFzqq1BzfRkZ2LMpp"; // استبدله بالتوكن الخاص بك من Dropbox

// 🔹 المسار إلى المجلد الذي تريد حذفه (مثلاً "/myFolder")
$path = "/" . $prodect_code ; 

$url = "https://api.dropboxapi.com/2/files/delete_v2";

// إعداد البيانات
$data = json_encode([
    "path" => $path
]);

// تهيئة cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $accessToken",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// تنفيذ الطلب
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 🔹 التحقق من النتيجة
if ($http_code == 200) {
    echo "✅ تم حذف المجلد بنجاح!";
} 

 if($type == "web_them"){
   include 'DataBase/prodect.php';
    $stmt = $conn->prepare("DELETE FROM web_them WHERE code = ?");
    $stmt->bind_param("s",$prodect_code);
    if($stmt->execute()){
      header("Location: API_webthem.php");
    };
    $stmt->close();
    $conn->close(); 
}elseif($type == "web_side"){
    include 'DataBase/prodect.php';
    $stmt = $conn->prepare("DELETE FROM web_side_stats WHERE code = ?");
    $stmt->bind_param("s",$prodect_code);
    if($stmt->execute()){
      header("Location: API_app_code.php");
    };
    $stmt->close();
    $conn->close(); 
}elseif($type == "app_code"){
     include 'DataBase/prodect.php';
    $stmt = $conn->prepare("DELETE FROM app_code WHERE code = ?");
    $stmt->bind_param("s",$prodect_code);
    if($stmt->execute()){
      header("Location: API_app_code.php");
    };
    $stmt->close();
    $conn->close(); 
}elseif($type == "appliction"){
     include 'DataBase/prodect.php';
    $stmt = $conn->prepare("DELETE FROM appliction WHERE code = ?");
    $stmt->bind_param("s",$prodect_code);
    if($stmt->execute()){
      header("Location: API_appliction.php");
    };
    $stmt->close();
    $conn->close(); 
}

}
?>