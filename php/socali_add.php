<?php
include "DataBase/social_db.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    // استقبال البيانات من النموذج (form)
    $facebook = $_GET['fac'] ?? '';
    $instgrame = $_GET['ins'] ?? '';
    $linkedin = $_GET['lin'] ?? '';
    $whatsapp = $_GET['wha'] ?? '';
    $Email = $_GET['mal'] ?? '';

    // نضع البيانات في مصفوفة
    $links = [
        'facebook'  => $facebook,
        'instagram' => $instgrame,
        'linkedin'  => $linkedin,
        'whatsapp'  => $whatsapp,
        'email'     => $Email
    ];

    // إعداد جملة SQL لتحديث العمود link
    $stmt = $conn->prepare("UPDATE social_links SET link = ? WHERE platform = ?");

    foreach ($links as $platform => $url) {
        $stmt->bind_param("ss", $url, $platform);
        $stmt->execute();
        echo "✅ تم تحديث $platform بنجاح<br>";
    }

    $stmt->close();
    $conn->close();
    header("Location: API_social.php");
} else {
    echo "❌ لم يتم استقبال أي بيانات من النموذج";
}
?>
