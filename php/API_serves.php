<?php
include 'DataBase/serves.php';
$sql = 'SELECT * FROM services';

$result = $conn ->query($sql);
if($result ->num_rows > 0){
    while($row = $result -> fetch_assoc()){
        $data[] = $row;
    }
    $json_data = json_encode($data,JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents("json/services.json",$json_data);
};
?>