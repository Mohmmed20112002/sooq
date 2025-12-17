<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require __DIR__ . '/PHPMailer/src/Exception.php';

if($_SERVER['REQUEST_METHOD'] === 'POST') {

    // استدعاء بيانات المستخدم
    $name = $_POST['user_name'];
    $email = $_POST['user_email'];
    $account = $_POST['account_type'];
    $phon = $_POST['phone'];
    $password = $_POST['password'];

    // التحقق من وجود البريد في قاعدة البيانات
    if($account === "seller"){
        include 'DataBase/sale.php';
        $stmt = $conn->prepare("SELECT * FROM sales WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows > 0){
            echo "هذا الإيميل موجود بالفعل قم بتسجيل الدخول";
            $stmt->close();
            $conn->close();
            exit;
        }
    } elseif($account === "freelanser"){
        include 'DataBase/freelanser_db.php';
        $stmt = $conn->prepare("SELECT * FROM freelancers WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows > 0){
            echo "هذا الإيميل موجود بالفعل قم بتسجيل الدخول";
            $stmt->close();
            $conn->close();
            exit;
        }
    }

    // حفظ الملف المرفوع (إن وجد)
    $file_name_param = '';
    if(isset($_FILES['id_seller']) && $_FILES['id_seller']['error'] === 0){
        $fileTmp  = $_FILES['id_seller']['tmp_name'];
        $fileName = $_FILES['id_seller']['name'];

        // حفظ الملف في مجلد uploads
        $upload_folder = __DIR__ . '/uploads/';
        if(!is_dir($upload_folder)){
            mkdir($upload_folder, 0777, true);
        }
        $target_path = $upload_folder . $fileName;
        move_uploaded_file($fileTmp, $target_path);

        $file_name_param = $fileName; // اسم الملف لإرساله في الرابط
    }

    // إنشاء الرابط مع جميع البيانات والمتغير id_seller_file
    $singin_link = "http://sooqcode.com/php/Singin.php?user_name=" . urlencode($name) . 
                   "&user_email=" . urlencode($email) .
                   "&passwoed=" . urlencode($password) .
                   "&account_type=" . urlencode($account) .
                   "&phone=" . urlencode($phon) .
                   "&id_seller_file=" . urlencode($file_name_param);

    // إرسال البريد باستخدام PHPMailer
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
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'بيانات مستخدم جديد من الموقع';
        $mail->Body = "
            <h2>مرحبًا بك في موقعنا</h2>
            <p><b>Coed X Press</b></p>
            <p>لقد تلقينا طلب إنشاء حساب جديد.</p>
            <p>رجاءً اضغط على الرابط التالي لإتمام عملية التسجيل:</p>
            <a href='$singin_link'>إتمام عملية التسجيل</a>
            <p><b>نوع الحساب:</b> $account</p>
        ";

        $mail->send();
        echo '✅ تم إرسال بريد التحقق من حسابك، تحقق من بريدك الالكتروني';
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => '❌ خطأ في الإرسال: ' . $mail->ErrorInfo], JSON_UNESCAPED_UNICODE);
    }

}
?>
sooqcode