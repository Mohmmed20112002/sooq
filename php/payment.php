<?php
// PayPal API Keys (Sandbox)
$clientId = "ASxeW63riGZAvXY6xqK2EpNJ7QPdFuO3kdCStVq1POKccxLigLqME81AbX8cYZ02dIcyRB1Z1Svgb4mv";
$secret   = "EK3_RqFjS-JKnQ3BeQwOhFIrX8cwgvZ03cOGRZIg5-dQvWO0lK79_auz09-a8D1UT-b_mnCuGLAxhlWi";

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status'=>'error','message'=>'الطلب يجب أن يكون POST']);
    exit;
}

// استقبال البيانات
$name    = $_POST['name']    ?? '';
$email   = $_POST['email']   ?? '';
$address = $_POST['address'] ?? '';
$phone   = $_POST['phon']    ?? '';
$product = $_POST['prodect'] ?? '';
$typ     = $_POST['typ']     ?? '';

// الاتصال بقاعدة البيانات
include 'DataBase/prodect.php';

// جلب السعر والبائع
$stmt = $conn->prepare("SELECT price, seller FROM $typ WHERE code = ?");
$stmt->bind_param("s", $product);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if (!$row) {
    echo json_encode(['status'=>'error','message'=>'المنتج غير موجود داخل قاعدة البيانات.']);
    exit;
}

$price  = $row['price'];
$seller = $row['seller'];
$profit = $price * 0.10;
$amount = $price + $profit;

// ===============================================================
// إنشاء رابط BASE_URL تلقائي صالح لـ localhost + الاستضافة
// ===============================================================
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$base_url = $protocol . "://" . $_SERVER['HTTP_HOST'];
$path = "/web_stor/php/";

// إنشاء return_url مع البيانات
$return_url = $base_url . $path ."result.php?status=success"
    . "&name="    . urlencode($name)
    . "&email="   . urlencode($email)
    . "&address=" . urlencode($address)
    . "&phone="   . urlencode($phone)
    . "&product=" . urlencode($product)
    . "&typ="     . urlencode($typ)
    . "&price="   . urlencode($price)
    . "&seller="  . urlencode($seller)
    . "&profit="  . urlencode($profit)
    . "&amount="  . urlencode($amount);

// cancel_url تلقائي
$cancel_url = $base_url . $path ."result.php?status=cancel";

// ===============================================================
// 1) الحصول على Access Token
// ===============================================================
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api-m.paypal.com/v1/oauth2/token");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_USERPWD, $clientId . ":" . $secret);
curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Accept-Language: en_US'
]);

$tokenResult = curl_exec($ch);

if ($tokenResult === false) {
    echo json_encode(['status'=>'error','message'=>"فشل في الحصول على Access Token: " . curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);

$tokenObj = json_decode($tokenResult);

if (!isset($tokenObj->access_token)) {
    echo json_encode(['status'=>'error','message'=>'لم يتم الحصول على Access Token','details'=>$tokenObj]);
    exit;
}

$accessToken = $tokenObj->access_token;

// ===============================================================
// 2) إنشاء طلب دفع PayPal
// ===============================================================
$data = [
    "intent" => "CAPTURE",
    "purchase_units" => [[
        "amount" => [
            "currency_code" => "USD",
            "value" => $amount
        ],
        "description" => "دفع من العميل $name"
    ]],
    "application_context" => [
        "return_url" => $return_url,
        "cancel_url" => $cancel_url
    ]
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api-m.paypal.com/v2/checkout/orders");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $accessToken"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(['status'=>'error','message'=>"خطأ أثناء إنشاء طلب الدفع: " . curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);

$order = json_decode($response);

// =================================================================
// معالجة الأخطاء
// =================================================================
if (isset($order->name) && isset($order->message)) {
    echo json_encode([
        'status'=>'error',
        'message'=>'PayPal Error',
        'code'=>$order->name,
        'details'=>$order->message
    ]);
    exit;
}

// =================================================================
// الحصول على رابط APPROVE
// =================================================================
if (isset($order->links)) {
    foreach ($order->links as $link) {
        if ($link->rel === 'approve') {
            echo json_encode(['status'=>'success','url'=>$link->href]);
            exit;
        }
    }
}

echo json_encode(['status'=>'error','message'=>'لم يتم العثور على رابط approve','response'=>$order]);
exit;
?>