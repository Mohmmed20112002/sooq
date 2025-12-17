<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    include 'DataBase/serves.php';

    // إذا كان الحذف
    if (isset($_POST['delet_code']) && !empty($_POST['delet_code'])) {

        $delet_code = $_POST['delet_code'];

        $stmt = $conn->prepare("DELETE FROM services WHERE code = ?");
        $stmt->bind_param("s", $delet_code);

        if ($stmt->execute()) {
            echo "تم حذف الطلب بنجاح!";
        } else {
            echo "خطأ أثناء الحذف: " . $stmt->error;
        }

        $stmt->close();
        $conn->close();
        exit(); // <-- مهم جداً
    }

    // إدخال بيانات جديدة
    if (
        isset($_POST['user_name'], $_POST['user_email'], $_POST['tel_type'], 
        $_POST['description'], $_POST['service'])
    ) {

        $user_name = $_POST['user_name'];
        $user_email = $_POST['user_email'];
        $tel_type = $_POST['tel_type'];
        $description = $_POST['description'];
        $service = $_POST['service'];

        $code = uniqid(); 

        $stmt = $conn->prepare("INSERT INTO services (service_type, code, name, email, phone, details)
                                VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $service, $code, $user_name, $user_email, $tel_type, $description);

        if ($stmt->execute()) {
            echo "تم حفظ البيانات بنجاح!";
            include 'API_serves.php';
        } else {
            echo "حدث خطأ: " . $stmt->error;
        }

        $stmt->close();
        $conn->close();
        exit();
    }

    echo "البيانات غير مكتملة!";
}
?>
