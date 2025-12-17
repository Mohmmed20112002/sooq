<?php
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $email   = trim($_POST['user_email']);
    $password    = trim($_POST['password']);
    $account = trim($_POST['account_type']);

    if($account == "seller"){
        include 'DataBase/sale.php';
        $conn->set_charset("utf8mb4");

        $sql = "SELECT * FROM sales WHERE LOWER(email) = LOWER(?) AND password = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $email, $password);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result->num_rows > 0){
           echo "seller";
        } else {
            echo "الايميل أو كلمة المرور غير صحيحة ❌";
        }
    }elseif($account == "freelanser"){
        include 'DataBase/freelanser_db.php';
        $conn->set_charset("utf8mb4");

        $sql = "SELECT * FROM freelancers WHERE LOWER(email) = LOWER(?) AND password = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $email, $password);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result->num_rows > 0){
           echo "freelancers";
        } else {
            echo "الايميل أو كلمة المرور غير صحيحة ❌";
            echo "<br>القيم المرسلة: [$email] | [$pass]";
        }

    }
}

?>