<?php
include 'DataBase/prodect.php';
$sql = 'SELECT * FROM appliction';

$result = $conn ->query($sql);
if($result ->num_rows > 0){
    while($row = $result -> fetch_assoc()){
        $data_5[] = $row;
    }
    $json_data = json_encode($data_5,JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents("json/appliction.json",$json_data);
};
?>
<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تم تنفيذ العملية</title>
    <style>
        /* Reset بسيط */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Cairo', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        }

        .container {
            text-align: center;
            background: #ffffff;
            padding: 40px 60px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            animation: fadeIn 1s ease-out;
        }

        .container h1 {
            color: #28a745;
            font-size: 32px;
            margin-bottom: 20px;
        }

        .container p {
            color: #333;
            font-size: 18px;
            margin-bottom: 30px;
        }

        .container button {
            padding: 12px 30px;
            font-size: 16px;
            background-color: #28a745;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .container button:hover {
            background-color: #218838;
            transform: scale(1.05);
        }

        @keyframes fadeIn {
            from {opacity: 0; transform: translateY(-20px);}
            to {opacity: 1; transform: translateY(0);}
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>✅ تم تنفيذ العملية بنجاح</h1>
        <p>شكراً لاستخدامك نظامنا، يمكنك العودة للصفحة الرئيسية الآن.</p>
    </div>
</body>
</html>
