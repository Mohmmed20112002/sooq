<?php
include 'DataBase/patment.php';

$sql = 'SELECT * FROM pay';

$result = $conn ->query($sql);
if($result ->num_rows > 0){
    while($row = $result -> fetch_assoc()){
        $data[] = $row;
    }
    $json_data = json_encode($data,JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents("json/payment.json",$json_data);
};
?>