<?php

$clientId = "ASxeW63riGZAvXY6xqK2EpNJ7QPdFuO3kdCStVq1POKccxLigLqME81AbX8cYZ02dIcyRB1Z1Svgb4mv";
$secret   = "EK3_RqFjS-JKnQ3BeQwOhFIrX8cwgvZ03cOGRZIg5-dQvWO0lK79_auz09-a8D1UT-b_mnCuGLAxhlWi";

// =====================
// إنشاء base URL على دومين فعلي (Live يحتاج HTTPS)
// =====================
$domain = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === "on" ? "https" : "http")
        . "://"
        . $_SERVER['HTTP_HOST']
        . "/";

// =====================
// معالجة المدخلات
// =====================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $serves = $_POST['serves'] ?? "";
    $amount = 0;

    $return_url = $domain . "index.html";        // يجب أن تكون روابط حقيقية
    $cancel_url = $domain . "payment_cancel.html";

    if ($serves === "AI_WEB") {
        $amount = 5;
        $return_url = $domain . "ai_webside/index.html";
    } elseif ($serves === "AI_CV") {
        $amount = 5;
        $return_url = $domain . "ai_cv/index.html";
    }

    if ($amount <= 0) {
        echo json_encode([
            "status" => "error",
            "message" => "المبلغ غير صالح"
        ]);
        exit;
    }

    // =====================
    // 1) طلب Access Token
    // =====================
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api-m.paypal.com/v1/oauth2/token"); // Live
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_USERPWD, $clientId . ":" . $secret);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Accept-Language: en_US'
    ]);

    $result = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($result, true);
    $accessToken = $result["access_token"] ?? null;

    if (!$accessToken) {
        echo json_encode([
            "status" => "error",
            "message" => "فشل في الحصول على Access Token",
            "details" => $result
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }

    // =====================
    // 2) إنشاء طلب الدفع
    // =====================
    $data = [
        "intent" => "CAPTURE",
        "purchase_units" => [[
            "amount" => [
                "currency_code" => "USD",
                "value" => $amount
            ]
        ]],
        "application_context" => [
            "return_url" => $return_url,
            "cancel_url" => $cancel_url
        ]
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api-m.paypal.com/v2/checkout/orders"); // Live
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer $accessToken"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    $order = json_decode($response, true);

    // =====================
    // 3) التحقق من الرابط وطباعة الأخطاء
    // =====================
    if (isset($order['links'])) {
        foreach ($order['links'] as $link) {
            if ($link['rel'] === "approve") {
                echo json_encode([
                    "status" => "success",
                    "url" => $link['href']
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                exit;
            }
        }
    }

    // إذا فشل، اطبع كل التفاصيل بشكل واضح
    echo json_encode([
        "status" => "error",
        "message" => "لم يتم إنشاء رابط الدفع",
        "response" => $order
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>
