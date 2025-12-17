<?php
// ======================================================
// 0) التحقق من وجود token و status
// ======================================================
if (!isset($_GET['status']) || $_GET['status'] !== 'success') {
    die("❌ عملية الدفع لم تتم بنجاح من PayPal.");
}

if (!isset($_GET['token'])) {
    die("❌ لا يوجد token للتحقق من عملية الدفع.");
}

$orderId = $_GET['token'];

// ------------------------------------------------------
// استقبال البيانات القادمة من return_url
// ------------------------------------------------------
$name   = $_GET['name'] ?? "";
$email  = $_GET['email'] ?? "";
$address= $_GET['address'] ?? "";
$phon   = $_GET['phone'] ?? "";
$prodect= $_GET['product'] ?? "";
$typ    = $_GET['typ'] ?? "";
$price  = $_GET['price'] ?? 0;
$seller = $_GET['seller'] ?? "";
$profit = $_GET['profit'] ?? 0;
$amount = $_GET['amount'] ?? 0;

// ------------------------------------------------------
// 1) التحقق من الدفع من PayPal (CAPTURE)
// ------------------------------------------------------
$clientId = "ASxeW63riGZAvXY6xqK2EpNJ7QPdFuO3kdCStVq1POKccxLigLqME81AbX8cYZ02dIcyRB1Z1Svgb4mv";
$secret   = "EK3_RqFjS-JKnQ3BeQwOhFIrX8cwgvZ03cOGRZIg5-dQvWO0lK79_auz09-a8D1UT-b_mnCuGLAxhlWi";

// --------- الحصول على Access Token ---------
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api-m.paypal.com/v1/oauth2/token");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, $clientId . ":" . $secret);
curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Accept-Language: en_US'
]);
$tokenResponse = curl_exec($ch);
curl_close($ch);

$tokenData = json_decode($tokenResponse, true);
$accessToken = $tokenData['access_token'] ?? null;

if (!$accessToken) {
    die("❌ فشل في الحصول على Access Token من PayPal.");
}

// --------- تنفيذ CAPTURE ---------
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api-m.paypal.com/v2/checkout/orders/$orderId/capture");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $accessToken"
]);

$captureResponse = curl_exec($ch);
curl_close($ch);

$captureData = json_decode($captureResponse, true);

// --------- التحقق من حالة الدفع ---------
$status = $captureData['status'] ?? '';

if ($status !== "COMPLETED") {
    die("❌ الدفع لم يكتمل من PayPal (Status: $status)");
}

// ======================================================
// 2) بعد التأكد من الدفع نبدأ في تحديث البيانات
// ======================================================

// --------- الاتصال بقاعدة البيانات ---------
include 'DataBase/home_db.php';  // $conn

// --------- جلب احصائيات الموقع ---------
$sql = "SELECT profits, sales FROM home LIMIT 1";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

$current_profits = $row['profits'];
$current_sales   = $row['sales'];

$new_profits = $current_profits + $profit;
$new_sales   = $current_sales + $amount;

// --------- تحديث الاحصائيات ---------
$update = "UPDATE home SET profits = '$new_profits', sales = '$new_sales'";
if (!$conn->query($update)) {
    die("❌ خطأ في تحديث الاحصائيات: " . $conn->error);
}

// ======================================================
// 3) بيانات المنتج
// ======================================================
include 'DataBase/prodect.php';  // $conn

$allowed_tables = ['appliction', 'app_code', 'web_side','web_them'];
if (!in_array($typ, $allowed_tables)) {
    die("Invalid table name");
}

$sql0 = "SELECT name, download_link, preview FROM `$typ` WHERE code = ?";
$stmt0 = $conn->prepare($sql0);
$stmt0->bind_param("s", $prodect);
$stmt0->execute();
$result0 = $stmt0->get_result();
if ($result0->num_rows == 0) die("❌ المنتج غير موجود");

$row0 = $result0->fetch_assoc();
$prodect_name  = $row0['name'];
$download_link = $row0['download_link'];
$preview       = $row0['preview'];

if ($typ == "web_side" || $typ == "appliction") {
    // حذف المنتج بعد الشراء
    $sql = "DELETE FROM `$typ` WHERE code = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $prodect);
    $stmt->execute();
} else {
    // زيادة preview
    $new_preview = $preview + 1;
    $update1 = $conn->prepare("UPDATE `$typ` SET preview = ? WHERE code = ?");
    $update1->bind_param("is", $new_preview, $prodect);
    $update1->execute();
}

// ======================================================
// 4) البائع
// ======================================================
include "DataBase/sale.php";  // $conn

$stmt2 = $conn->prepare("SELECT name, wallet FROM sales WHERE code = ?");
$stmt2->bind_param("s", $seller);
$stmt2->execute();
$result2 = $stmt2->get_result();
if ($result2->num_rows == 0) die("❌ البائع غير موجود");

$row2 = $result2->fetch_assoc();
$seller_name = $row2['name'];
$new_wallet  = $row2['wallet'] + $price;

$update2 = $conn->prepare("UPDATE sales SET wallet = ? WHERE code = ?");
$update2->bind_param("ds", $new_wallet, $seller);
$update2->execute();

// ======================================================
// 5) تسجيل عملية البيع
// ======================================================
include 'DataBase/home_db.php';

$today = date("Y-m-d h:i A");

$sql1 = "INSERT INTO sales (product_name, seller_name, customer_name, customer_phone, customer_email, customer_address, price, profit, created_at, seller_code, type)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt1 = $conn->prepare($sql1);

$stmt1->bind_param(
    "ssssssddsss",
    $prodect_name,
    $seller_name,
    $name,
    $phon,
    $email,
    $address,
    $price,
    $profit,
    $today,
    $seller,
    $typ
);

$stmt1->execute();
$conn->close();

// ======================================================
// 6) الانتقال إلى صفحة التحميل
// ======================================================
?>
<!DOCTYPE html>
<html>
<head>
    <title>Redirecting...</title>
</head>
<body>
<script>
    localStorage.setItem("downlode", "<?php echo $download_link; ?>");
    window.location.href = "/web_stor/pay.html";
</script>
</body>
</html>
