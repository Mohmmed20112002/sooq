<?php
include 'DataBase/sale.php';
$sql = 'SELECT * FROM sales';

$result = $conn ->query($sql);
if($result ->num_rows > 0){
    while($row = $result -> fetch_assoc()){
        $data_2[] = $row;
    }
    $json_data = json_encode($data_2,JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents("json/sales.json",$json_data);
};
?>
