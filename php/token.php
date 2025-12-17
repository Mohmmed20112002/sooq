<?php
 // نفس Redirect URI المستخدم عند طلب الكود

$ch = curl_init("https://api.dropbox.com/oauth2/token");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'code' => $authCode,
    'grant_type' => 'authorization_code',
    'client_id' => $clientId,
    'client_secret' => $clientSecret,
    'redirect_uri' => $redirectUri
]));

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if(isset($data['refresh_token'])){
    echo "Refresh Token: " . $data['refresh_token'] . "\n";
    echo "Access Token (مؤقت): " . $data['access_token'] . "\n";
} else {
    echo "❌ حدث خطأ: " . $response;
}
?>
