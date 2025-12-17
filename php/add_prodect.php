<?php
// 🔹 إعدادات Dropbox
$clientId = "bbp9u3kep7rgh9m";
$clientSecret = "wgc54tv5hv5qcgh";
$refreshToken = "2KGgkphsb7IAAAAAAAAAAdc39XckDLoTVtGSekpi6YBTIJxAW7BZ_KOCNhxO5aOe"; // ضع هنا Refresh Token الحقيقي

// ================================
// 🔹 توليد Access Token دائم باستخدام Refresh Token
// ================================
$ch = curl_init("https://api.dropbox.com/oauth2/token");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'grant_type' => 'refresh_token',
    'refresh_token' => $refreshToken,
    'client_id' => $clientId,
    'client_secret' => $clientSecret
]));
$response = curl_exec($ch);
if(curl_errno($ch)){
    die("❌ خطأ في توليد Access Token: " . curl_error($ch));
}
curl_close($ch);

$data = json_decode($response, true);
if(!isset($data['access_token'])){
    die("❌ لم يتم الحصول على Access Token: " . $response);
}

$accessToken = $data['access_token'];// 🔹 استقبال بيانات النموذج
$prodect_name  = $_POST['prodect_name']  ?? '';//اسم المنتج
$prodect_code = $_POST['prodect_code'] ?? '';

if (empty($prodect_code)) {
    // توليد رقم عشوائي مكون من 16 رقم
    $prodect_code = str_pad(random_int(0, 9999999999999999), 16, '0', STR_PAD_LEFT);
}

$description   = $_POST['description']   ?? '';//الوصف
$prodect_price = $_POST['prodect_price'] ?? '';//السعر
$type          = $_POST['type']          ?? '';//النوع
$seller        = $_POST['seller']        ?? '';//البائع
$tole          = $_POST['tole']          ?? '';//الادوات المستخدمه
$view_page     = $_POST['view_page']     ?? '';//صفحة الظهور
$prodect_type  = $_POST['prodect_type']  ?? '';//حالة المنتج نشط او غير نشط 
$view_link     = $_POST['view_link']  ?? '';// رابط المشاهده
$ification     = $_POST['ification'] ?? '';// التصنيفification
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
//===========================================================
if (empty($prodect_code)) {
    $prodect_code = str_pad(mt_rand(0, 9999999999999999), 16, '0', STR_PAD_LEFT);
}
$downloadFile  = $_FILES['downlode'] ?? null;
$images        = $_FILES['images']   ?? null;

// ====================================================
//  🔸 إنشاء مجلد باسم كود المنتج بدلًا من اسم المنتج
// ====================================================
$folderPath = "/" . trim($prodect_code);

$createFolder = curl_init("https://api.dropboxapi.com/2/files/create_folder_v2");
curl_setopt_array($createFolder, [
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $accessToken",
        "Content-Type: application/json"
    ],
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode(["path" => $folderPath]),
    CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($createFolder);
curl_close($createFolder);

// ✅ إذا كان المجلد موجود مسبقًا، نستخدمه فقط ولا نوقف التنفيذ
if (strpos($response, 'conflict/folder') !== false) {
    echo "📁 المجلد موجود مسبقًا، سيتم استخدامه.\n";
} elseif (strpos($response, 'error_summary') !== false) {
    die("❌ حدث خطأ أثناء إنشاء المجلد: $response");
}

// ====================================================
// 🔸 رفع ملف التحميل داخل مجلد الكود
// ====================================================
if ($downloadFile && $downloadFile['tmp_name']) {
    $download_name = basename($downloadFile['name']);
    $dropboxDownloadPath = "$folderPath/$download_name";
    $fileData = file_get_contents($downloadFile['tmp_name']);

    $upload = curl_init("https://content.dropboxapi.com/2/files/upload");
    curl_setopt_array($upload, [
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $accessToken",
            "Dropbox-API-Arg: " . json_encode([
                "path" => $dropboxDownloadPath,
                "mode" => "add",
                "autorename" => true,
                "mute" => false
            ]),
            "Content-Type: application/octet-stream"
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $fileData,
        CURLOPT_RETURNTRANSFER => true
    ]);
    curl_exec($upload);
    curl_close($upload);

    // إنشاء رابط تحميل مباشر للملف
    $createLink = curl_init("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings");
    curl_setopt_array($createLink, [
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $accessToken",
            "Content-Type: application/json"
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(["path" => $dropboxDownloadPath]),
        CURLOPT_RETURNTRANSFER => true
    ]);
    $linkResponse = curl_exec($createLink);
    curl_close($createLink);
    $linkData = json_decode($linkResponse, true);
    $download_link = isset($linkData['url']) ? str_replace("?dl=0", "?raw=1", $linkData['url']) : '';
} else {
    $download_link = '';
}

// ====================================================
// 🔸 رفع الصور (داخل نفس مجلد الكود)
// ====================================================
$img_links = [];
if ($images && isset($images['tmp_name'])) {
    for ($i = 0; $i < count($images['name']); $i++) {
        $fileTmp = $images['tmp_name'][$i];
        $fileName = basename($images['name'][$i]);
        $dropboxImagePath = "$folderPath/$fileName";

        if (!$fileTmp) continue;

        $data = file_get_contents($fileTmp);
        $ch = curl_init("https://content.dropboxapi.com/2/files/upload");
        curl_setopt_array($ch, [
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer $accessToken",
                "Dropbox-API-Arg: " . json_encode([
                    "path" => $dropboxImagePath,
                    "mode" => "add",
                    "autorename" => true,
                    "mute" => false
                ]),
                "Content-Type: application/octet-stream"
            ],
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_RETURNTRANSFER => true
        ]);
        curl_exec($ch);
        curl_close($ch);

        // إنشاء رابط عرض مباشر لكل صورة
        $createLinkImg = curl_init("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings");
        curl_setopt_array($createLinkImg, [
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer $accessToken",
                "Content-Type: application/json"
            ],
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode(["path" => $dropboxImagePath]),
            CURLOPT_RETURNTRANSFER => true
        ]);
        $resp = curl_exec($createLinkImg);
        curl_close($createLinkImg);
        $linkImgData = json_decode($resp, true);
        $img_links[] = isset($linkImgData['url']) ? str_replace("?dl=0", "?raw=1", $linkImgData['url']) : '';
    }
}

// ====================================================
// 🔸 إنشاء متغيرات img_1 إلى img_8
// ====================================================
for ($i = 0; $i < count($img_links); $i++) {
    ${"img_" . ($i + 1)} = $img_links[$i];
}
// اضافة web_them. في حالة كان المنتج كود لموقع الكتروني 
if($type == "web_them"){ 
include 'DataBase/prodect.php';

$sql = "INSERT INTO web_them 
(name, description, code, price, image1, image2, image3, image4, image5, image6, image7, image8, seller, technologies, download_link, page_link,view_link , type, ification )
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?,? ,? )";

// تجهيز الاستعلام
$stmt = $conn->prepare($sql);

// تحديد أنواع البيانات لكل حقل
$stmt->bind_param(
  "sssdsssssssssssssss",
  $prodect_name, $description , $prodect_code, $prodect_price,
  $img_1, $img_2, $img_3, $img_4, $img_5, $img_6, $img_7, $img_8,
  $seller, $tole, $download_link, $view_page, $view_link, $prodect_type, $ification 
);

// تنفيذ الإدخال
if ($stmt->execute()) {
  header("Location: API_webthem.php");
} else {
  echo "❌ حدث خطأ أثناء الإضافة: " . $conn->error;
}

$stmt->close();
$conn->close();
}elseif ($type == "web_side"){

include 'DataBase/prodect.php';
$sql = "INSERT INTO web_side
(name, code, price, image1, image2, image3, image4, image5, image6, image7, image8, seller, technologies, download_link, page_link, visits, monthly_earnings, description, view_link, ification, type)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

// تجهيز الاستعلام
$stmt = $conn->prepare($sql);

// تحديد أنواع البيانات لكل حقل
$stmt->bind_param(
  "ssdssssssssssssssssss",
  $prodect_name, $prodect_code, $prodect_price, 
  $img_1, $img_2, $img_3, $img_4, $img_5, $img_6, $img_7, $img_8, 
  $seller, $tole, $download_link, $view_page, $visity, 
  $monthly, $description, $view_link,$ification, $prodect_type
);

// تنفيذ الإدخال
if ($stmt->execute()) {
  header("Location: API_webside.php");
} else {
  echo "❌ حدث خطأ أثناء الإضافة: " . $conn->error;
}

$stmt->close();
$conn->close();
//في حالة كان المنتج كود لتطبيق 
}elseif($type === "app_code"){
    
include 'DataBase/prodect.php';
$sql = "INSERT INTO app_code
(name, code, price, image1, image2, image3,	image4,	image5,	image6,	image7, image8,	seller,	download_link, technologies, page_link,	operating_system, description, type, ification, view_link)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

// تجهيز الاستعلام
$stmt = $conn->prepare($sql);

// تحديد أنواع البيانات لكل حقل
$stmt->bind_param(
  "ssdsssssssssssssssss",
  $prodect_name, $prodect_code, $prodect_price, 
  $img_1, $img_2, $img_3, $img_4, $img_5, $img_6, $img_7, $img_8, 
  $seller, $download_link, $tole, $view_page, $operating_system, 
  $description, $prodect_type, $ification, $view_link 
  
);

// تنفيذ الإدخال
if ($stmt->execute()) {
  header("Location: API_app_code.php");
} else {
  echo "❌ حدث خطأ أثناء الإضافة: " . $conn->error;
}

$stmt->close();
$conn->close();
}elseif($type === "appliction"){
include 'DataBase/prodect.php';
$sql = "INSERT INTO appliction
(name, code, price, image1,	image2,	image3,	image4,	image5,	image6,	image7,	image8,	seller, download_link, technologies, page_link,	operating_system, downloads, monthly_earnings, description, view_link, ification, type)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

// تجهيز الاستعلام
$stmt = $conn->prepare($sql);

// تحديد أنواع البيانات لكل حقل
$stmt->bind_param(
  "ssdsssssssssssssssssss",
  $prodect_name, $prodect_code, $prodect_price, 
  $img_1, $img_2, $img_3, $img_4, $img_5, $img_6, $img_7, $img_8, 
  $seller, $download_link, $tole, $view_page, $operating_system, 
  $downloads, $monthly_earnings, $description, $view_link,$ification, $prodect_type 
  
);

// تنفيذ الإدخال
if ($stmt->execute()) {
  header("Location: API_appliction.php");
} else {
  echo "❌ حدث خطأ أثناء الإضافة: " . $conn->error;
}

$stmt->close();
$conn->close(); 
}
//في حالة كان المنتج موقع الكتروني كامل 

?>
