<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require __DIR__ . '/PHPMailer/src/Exception.php';

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
     $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'aadmtwers7@gmail.com'; 
        $mail->Password   = 'sbxt uapk gwya xiqs'; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('aadmtwers7@gmail.com', 'Website Form');
        $mail->addAddress('aadmtwers7@gmail.com');

        $mail->isHTML(true);
        $mail->Subject = 'استفسار من موقع sooqcode';
        $mail->Body = "
            <h2>رسالة استفسار من عميل</h2>
            <p><b>Sooq Code</b></p>
            <p>$message.</p>
            <p>الاسم : $name </p>
            <a href='$email'> الرد عبر الايميل</a>
        ";

        $mail->send();
        echo '   تم إرسال رسالتك بنجاح انتظر الرد  ';
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => '❌ خطأ في الإرسال: ' . $mail->ErrorInfo], JSON_UNESCAPED_UNICODE);
    }

}

?>