<?php
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $user = $_POST['user'];
    $code = $_POST['code'];

    // افترض أن هذا الملف يحتوي على اتصال قاعدة البيانات $conn

    if($user == "active"){
         include 'DataBase/sale.php';
        // تحديث العمود activet إلى 'active' في الصف الذي يطابق $code
        $stmt = $conn->prepare("UPDATE sales SET activet = 'active' WHERE code = ?");
        $stmt->bind_param("s", $code); // s لأن $code نص
        if($stmt->execute()){
            echo "تم تفعيل الحساب بنجاح";
            include 'API_sale.php';
        } else {
            echo "حدث خطأ أثناء التفعيل";
        }
        $stmt->close();

    } elseif($user == "delet"){

    include 'DataBase/sale.php';

    // أولًا: الحصول على اسم الملف id_seller
    $stmt = $conn->prepare("SELECT id_seller FROM sales WHERE code = ?");
    $stmt->bind_param("s", $code);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
        $fileName = $row['id_seller']; // اسم الملف
        $stmt->close();

        // مسار الملف داخل مجلد uploads
        $filePath = "uploads/" . $fileName;

        // حذف الملف إذا كان موجودًا
        if(file_exists($filePath)){
            unlink($filePath);
        }

        // ثانيًا: حذف الصف من قاعدة البيانات
        $stmt = $conn->prepare("DELETE FROM sales WHERE code = ?");
        $stmt->bind_param("s", $code);

        if($stmt->execute()){
            echo "تم حذف الحساب والملف بنجاح";
            include 'API_sale.php';
        } else {
            echo "حدث خطأ أثناء حذف الحساب";
        }

        $stmt->close();

    } else {
        echo "لم يتم العثور على البيانات";
    }

    } 

    $conn->close();
}
?>
