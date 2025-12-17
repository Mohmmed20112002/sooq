<?php

$article_title = $_POST['article_title'] ?? '';
$article_desc  = $_POST['subtitle'] ?? '';
$article_link  =$_POST['article_link'] ?? ' ';
$date          = date("Y-m-d");

    include 'DataBase/artical.php';

    $sql = "INSERT INTO artical_details (main_title, sub_title, article_link, articale_date) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) die("❌ خطأ في التحضير: " . $conn->error);

    $stmt->bind_param("ssss", $article_title, $article_desc, $article_link, $date);

    if ($stmt->execute()) {
       include 'API_artical.php';
    } else {
        echo "❌ خطأ أثناء التنفيذ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
?>
