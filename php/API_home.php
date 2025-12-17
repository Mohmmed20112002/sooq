<?php
include 'DataBase/home_db.php';
$sql = 'SELECT * FROM  home';

$result = $conn ->query($sql);
if($result ->num_rows > 0){
    while($row = $result -> fetch_assoc()){
        $data_6[] = $row;
    }
    $json_data = json_encode($data_6,JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents("json/home.json",$json_data);
};
?>

