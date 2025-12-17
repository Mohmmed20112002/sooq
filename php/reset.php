<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// استدعاء ملفات PHPMailer من داخل مجلد php
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require __DIR__ . '/PHPMailer/src/Exception.php';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    
    $email   = trim($_POST['user_email']);
    $account = trim($_POST['account_type']);

   if($account == "seller"){
        include 'DataBase/sale.php';
       $sql = "SELECT password FROM sales WHERE email = ?";
       $stmt = $conn->prepare($sql);
       $stmt->bind_param("s", $email);
       $stmt->execute();
       $result = $stmt->get_result();
       if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $password = $row['password']; // الباسورد من قاعدة البيانات
      $mail = new PHPMailer(true);
        $mail->CharSet = 'UTF-8';  // مهم جدًا
        $mail->Encoding = 'base64';
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'aadmtwers7@gmail.com'; // بريدك
            $mail->Password   = 'sbxt uapk gwya xiqs'; // App Password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            // المرسل والمستقبل
            $mail->setFrom('aadmtwers7@gmail.com', 'Website Form');
            $mail->addAddress($email);

            // المحتوى
            $mail->isHTML(true);
            $mail->Subject = 'طلب الحصول علي كلمة المرور';
            $mail->Body = "
                <h2>مرحبًا بك في موقعنا</h2>
                <p><b>Coed X Press</b></p>
                <p>لقد تلقينا طلب انك نسيت كلمة المرور الخاصه بك.</p>
                <p>كلمة المرور الخاصه بك هلي $password</p>
            ";

            $mail->send();
            echo  '✅ تم إرسال بريد التحقق الي حسابك، تحقق من بريدك الالكتروني';
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => '❌ خطأ في الإرسال: ' . $mail->ErrorInfo], JSON_UNESCAPED_UNICODE);
        }

} else {
    echo "لم يتم العثور على المستخدم.";
} 
    }elseif($account == "freelanser"){
        include 'DataBase/freelanser_db.php';
            $sql = "SELECT password FROM freelancers WHERE email = ?";
       $stmt = $conn->prepare($sql);
       $stmt->bind_param("s", $email);
       $stmt->execute();
       $result = $stmt->get_result();
       if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $passwor = $row['password']; // الباسورد من قاعدة البيانات
      $mail = new PHPMailer(true);
        $mail->CharSet = 'UTF-8';  // مهم جدًا
        $mail->Encoding = 'base64';
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'aadmtwers7@gmail.com'; // بريدك
            $mail->Password   = 'sbxt uapk gwya xiqs'; // App Password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            // المرسل والمستقبل
            $mail->setFrom('aadmtwers7@gmail.com', 'Website Form');
            $mail->addAddress($email);

            // المحتوى
            $mail->isHTML(true);
            $mail->Subject = 'طلب الحصول علي كلمة المرور';
            $mail->Body = "
                <h2>مرحبًا بك في موقعنا</h2>
                <p><b>Coed X Press</b></p>
                <p>لقد تلقينا طلب انك نسيت كلمة المرور الخاصه بك.</p>
                <p>كلمة المرور الخاصه بك هلي $passwor</p>
            ";

            $mail->send();
            echo  '✅ تم إرسال بريد التحقق الي حسابك، تحقق من بريدك الالكتروني';
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => '❌ خطأ في الإرسال: ' . $mail->ErrorInfo], JSON_UNESCAPED_UNICODE);
        }

} else {
    echo "لم يتم العثور على المستخدم.";
} 

    }

}
?>