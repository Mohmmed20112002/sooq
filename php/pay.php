<?php

$clientId = "AVFuBI8w21_oYDNFaiFqFvq1hrOKKVtxVUDYq4KkCdrjbbep9_LzBLDCd4l0Vp9HxDUL8m27PqpSu3Q-";
$secret   = "ED8Yt3ZnMYPqqpU0Sok_pG1bn-0NJ7ObNmpKJ4l6VzpPtaHXAvgO9styB0beh51O2PgKg7MW7BiMc92S";

// =====================
// إنشاء base URL بدون أي مجلدات
// =====================

$domain = (isset($_SERVER['HTTPS']) ? "https" : "http")
        . "://"
        . $_SERVER['HTTP_HOST']
        . "/";

// مثال النتيجة:
// http://localhost/
// https://yourdomain.com/

// =====================
// معالجة المدخلات
// =====================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $serves = $_POST['serves'] ?? "";
    $amount = 0;

    // روابط افتراضية
    $return_url = $domain . "index.html";
    $cancel_url = $domain . "payment_cancel.html";

    // خدمة AI_WEB
    if ($serves === "AI_WEB") {
        $amount = 5;
        $return_url = $domain . "ai_webside/index.html";
    }

    // خدمة AI_CV
    elseif ($serves === "AI_CV") {
        $amount = 5;
        $return_url = $domain . "ai_cv/index.html";
    }


    // =====================
    // 1) طلب Access Token
    // =====================
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api-m.sandbox.paypal.com/v1/oauth2/token");
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
            "message" => "فشل في الحصول على Access Token"
        ]);
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
    curl_setopt($ch, CURLOPT_URL, "https://api-m.sandbox.paypal.com/v2/checkout/orders");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer $accessToken"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    $order = json_decode($response);

    // =====================
    // 3) استخراج رابط الموافقة
    // =====================
    if (isset($order->links)) {
        foreach ($order->links as $link) {
            if ($link->rel === "approve") {
                echo json_encode([
                    "status" => "success",
                    "url" => $link->href
                ]);
                exit;
            }
        }
    }

    echo json_encode([
        "status" => "error",
        "message" => "لم يتم إنشاء رابط الدفع"
    ]);
}
?>
