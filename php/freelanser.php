<?php

if($_SERVER['REQUEST_METHOD'] === 'POST'){

$action = $_POST['action'] ?? '';

/* ===================================================
   • استدعاء بيانات مستخدم berdasarkan email
   =================================================== */
if($action === "call"){
    
    $email  = $_POST['email'] ?? '';

    if(!empty($email)){
        include 'DataBase/freelanser_db.php';

        $sql = "SELECT name, phone, type, code, image, linkedin, description, paypal, address, skills, experience_years
                FROM freelancers 
                WHERE email = ?";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            echo "code:" . $row['code'] .
                 ";type:" . $row['type'] .
                 ";name:" . $row['name'] .
                 ";phone:" . $row['phone'] .
                 ";linkedin:" . $row['linkedin'] .
                 ";image:" . $row['image'] .
                 ";description:" . $row['description'] . 
                 ";paypal:" . $row['paypal'] .
                 ";address:" . $row['address'] .
                 ";skilss:" . $row['skills'] .
                 ";experience_years:" . $row['experience_years'];
                 
        } else {
            echo "error:not_found";
        }

        $stmt->close();
        $conn->close();
    }
    exit;
}


/* ===================================================
   • تعديل بيانات المستخدم
   =================================================== */
if($action === "edit"){

    include 'DataBase/freelanser_db.php';

    // المعلومات الأساسية
    $name      = $_POST['name']      ?? '';
    $email     = $_POST['email']     ?? '';
    $phone     = $_POST['phone']     ?? '';
    $user_type = $_POST['user_type'] ?? '';
    $address   = $_POST['address']   ?? '';
    $year      = $_POST['year']      ?? 0;
    $skales    = $_POST['skales']    ?? '';
    $linked_in = $_POST['linked_in'] ?? '';
    $paypale   = $_POST['paypale']   ?? '';
    $about     = $_POST['about']     ?? '';


$imageURL = null; // افتراضي لو مفيش صورة جديدة

if (!empty($_FILES['image']['name'])) {
    $fileTmp  = $_FILES['image']['tmp_name'];
    $fileName = time() . "_" . $_FILES['image']['name'];

    // مجلد الحفظ المحلي
    $uploadDir = "uploads/freelanser/";

    // تأكد من وجود المجلد
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // مسار كامل للحفظ
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($fileTmp, $targetPath)) {
        // رابط المشاهدة (يمكن استخدام النسخة النسبية أو رابط كامل)
        $imageURL = $targetPath;
    } else {
        echo "فشل رفع الصورة محليًا!";
        exit;
    }
}


    /* ===================================================
       • رفع الصورة إلى Darabox
       =================================================== */



    /* ===================================================
       • تحديث قاعدة البيانات
       =================================================== */

    if ($imageURL !== null) {

        $sql = "UPDATE freelancers SET 
                    name=?, phone=?, type=?, address=?, experience_years=?, skills=?, 
                    linkedin=?, paypal=?, description=?, image=?
                WHERE email=?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssissssss",
            $name, $phone, $user_type, $address, $year, $skales,
            $linked_in, $paypale, $about, $imageURL, $email
        );
        

    } else {

        $sql = "UPDATE freelancers SET 
                    name=?, phone=?, type=?, address=?, experience_years=?, skills=?, 
                    linkedin=?, paypal=?, description=?
                WHERE email=?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssisssss",
            $name, $phone, $user_type, $address, $year, $skales,
            $linked_in, $paypale, $about, $email
        );
    }


    if ($stmt->execute()) {
        include 'API_freelanser.php';
        echo "تم تحديث البيانات بنجاح ✔";
    } else {
        echo "خطأ في التحديث: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
}

?>
