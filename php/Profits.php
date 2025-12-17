<?php
if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $SellerName   = $_POST['SellerName'] ?? "";
    $SellerCode   = $_POST['SellerCode'] ?? "";
    $SellerPhone  = $_POST['SellerPhone'] ?? "";
    $SellerEmail  = $_POST['SellerEmail'] ?? "";
    $SellerPaypal = $_POST['SellerPaypal'] ?? "";
    $SellerWallat = $_POST['SellerWallat'] ?? "";
    $SellerEdit   = $_POST['SellerEdit']?? "";
    include 'DataBase/sale.php';
    if(!empty($SellerName) && !empty($SellerCode) && !empty($SellerEmail)){


    // استعلام لجلب قيمة المحفظة من قاعدة البيانات
    $sql = "SELECT wallet FROM sales WHERE code = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s",$SellerCode);
    $stmt->execute();

    $result = $stmt->get_result();

    if($result->num_rows > 0){

        $row = $result->fetch_assoc();

        // تعريف قيمة المحفظة في قاعدة البيانات
        $databaseWallat = $row['wallet'];

        // مقارنة القيم
        if ($SellerWallat == $databaseWallat) {

            // تحديث المحفظة إلى 0
            $updateSql = "UPDATE sales SET wallet = 0 WHERE code = ?";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param("s", $SellerCode);

            if ($updateStmt->execute()) {
                include 'DataBase/patment.php';
                    // أمر الإدخال في الجدول pay
    $sql = "INSERT INTO pay (name, code, payment_method, payment_email, phone_number, email)
            VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "ssssss",
        $SellerName,      // name
        $SellerCode,      // code
        $SellerWallat,    // payment_method (كما طلبت)
        $SellerPaypal,    // payment_email
        $SellerPhone,     // phone_number
        $SellerEmail      // email
    );

    if($stmt->execute()){
        echo "تم تسجيل بينات الدفع بنجاح سيتم تحويل المبلغ لك في اقرب وقت.";
        include 'API_payment.php';
    } else {
        echo "خطأ أثناء الحفظ: " . $conn->error;
    }
            } else {
                echo "Error: " . $conn->error;
            }

        } else {
            echo "القيمة المرسلة لا تطابق قيمة المحفظة المسجلة.";
        }

    } else {
        echo "لا يوجد بائع بهذا الكود.";
    }}
    if(!empty($SellerEdit) && $SellerEdit == "delet"){
      include 'DataBase/patment.php';
        // استعلام الحذف
        $sql = "DELETE FROM pay WHERE code = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $SellerCode);

        if ($stmt->execute()) {
            echo "تم حذف العملية بنجاح";
            include 'API_payment.php';
        } else {
            echo "حدث خطأ أثناء الحذف: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "قيمة SellerCode فارغة ولا يمكن الحذف.";
    
    }


}

?>
