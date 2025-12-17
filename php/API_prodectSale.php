<?php
include 'DataBase/home_db.php';
$sql = 'SELECT * FROM sales';

$result = $conn ->query($sql);
if($result ->num_rows > 0){
    while($row = $result -> fetch_assoc()){
        $data_1[] = $row;
    }
    $json_data = json_encode($data_1,JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents("json/prodectSale.json",$json_data);
};

?>