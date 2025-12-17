<?php
if($_SERVER['REQUEST_METHOD']=== 'POST'){
    $email = $_POST['user_email'];
    $account = $_POST['account_type'];

    if($account == "seller"){
        include 'DataBase/sale.php';

        $sql = "SELECT code, wallet, name, phone, password, activet FROM sales WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            // نطبع القيم بشكل منسق يسهل استخراجها
            echo "code:" . $row['code'] . ";wallet:" . $row['wallet'] . ";name:" . $row['name'] . ";phone:" . $row['phone'] . ";password:" . $row['password'] . ";activet:" . $row['activet'];
        } else {
            echo "error:not_found";
        }

        $stmt->close();
        $conn->close();
    }
}
?>
