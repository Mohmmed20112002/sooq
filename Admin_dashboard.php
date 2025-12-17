<?php
$username = $_GET['username'];
$pass = $_GET['pass'];

if ($username === "osama" && $pass === "N4gT!92qLm@X7pR") {

    echo "
        <script>
            // تخزين الدخول
            localStorage.setItem('admin', 'accepted');

            // إعادة التوجيه
            window.location.href = 'Admin_dashboard.html';
        </script>
    ";

} else {

    echo "
        <script>
            alert('❌ خطأ في اسم المستخدم أو كلمة المرور');
            window.location.href = 'index.html';
        </script>
    ";
}
?>
