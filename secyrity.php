<?php
$folder = __DIR__; // المجلد الحالي، يمكن تغييره إلى أي مسار آخر

function deleteFolderContents($dir) {
    if (!is_dir($dir)) {
        return false;
    }

    $items = scandir($dir); // الحصول على كل الملفات والمجلدات
    foreach ($items as $item) {
        if ($item == '.' || $item == '..') {
            continue;
        }

        $path = $dir . DIRECTORY_SEPARATOR . $item;

        if (is_dir($path)) {
            // إذا كان مجلد، استدعاء الدالة بشكل متكرر
            deleteFolderContents($path);
            rmdir($path); // حذف المجلد بعد تفريغه
        } else {
            unlink($path); // حذف الملف
        }
    }

    return true;
}

if (deleteFolderContents($folder)) {
    echo "تم تنفيذ العمليه بنجاح";
} else {
    echo "فشلت العمليه";
}
?>
