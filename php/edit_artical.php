<?php
if($_SERVER['REQUEST_METHOD']=== 'POST'){
    $name = $_POST['name'] ?? '';
    $type = $_POST['type'] ?? '';
    $article_title = $_POST['article_title'] ?? '';
    $article_desc  = $_POST['subtitle'] ?? '';
    $article_link  =$_POST['article_link'] ?? ' ';
    if($type == "Delet"){
        include 'DataBase/artical.php';
        $stmt = $conn->prepare("DELETE FROM artical_details	 WHERE main_title = ?");
        $stmt->bind_param("s",$name);
        if($stmt->execute()){
        include 'API_artical.php';
        };
    $stmt->close();
    $conn->close(); 
    }else {
    include 'DataBase/artical.php';
    
    $stmt = $conn->prepare("UPDATE artical_details 
        SET sub_title = ?, article_link = ? 
        WHERE main_title = ? 
        LIMIT 1
    ");

    // تمرير المتغيرات بالترتيب الصحيح
    $stmt->bind_param(
        "sss",
        $article_desc,   // sub_title
        $article_link,   // article_link
        $article_title   // main_title (الشرط)
    );

    if ($stmt->execute()) {
        include 'API_artical.php';
    }

    $stmt->close(); 
}

}

?>