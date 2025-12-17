<?php
if($_SERVER['REQUEST_METHOD'] === 'POST'){
  $user_name  = $_POST['user_name'] ?? '';
  $user_email = $_POST['user_email'] ?? '';
  $edit_type  = $_POST['edit_type'] ?? '';
  $phone      = $_POST['phone'] ?? '';
  $code       = $_POST['code'] ?? '';
  $new_pass   = $_POST['new_pass'] ?? '';

  // تعديل البيانات الأساسية
  if($edit_type == "data"){
    if(!empty($code) && !empty($user_name) && !empty($user_email) && !empty($phone)){
        include 'DataBase/sale.php';

        $sql = "UPDATE sales SET name = ?, email = ?, phone = ? WHERE code = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $user_name, $user_email, $phone, $code);

        if($stmt->execute()){
            echo "تم تحديث البيانات بنجاح";
        }else{
            echo "حدث خطأ أثناء تحديث البيانات";
        }

        $stmt->close();
        $conn->close();
    }else{
        echo "يجب ملء جميع الحقول";
    }
  }

  // تعديل كلمة المرور
  elseif($edit_type == "pass"){
    if(!empty($new_pass) && !empty($code)){ 

        include 'DataBase/sale.php';

        $sql = "UPDATE sales SET password = ? WHERE code = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $new_pass, $code);

        if($stmt->execute()){
            echo "تم تحديث كلمة المرور بنجاح";
        }else{
            echo "حدث خطأ أثناء تحديث كلمة المرور";
        }

        $stmt->close();
        $conn->close();
    } else {
        echo "يجب كتابة كلمة المرور الجديدة";
    }
  }

}
?>
