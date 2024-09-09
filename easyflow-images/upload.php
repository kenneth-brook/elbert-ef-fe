<?php
$target_dir = "uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

$upload_results = [];

foreach ($_FILES["imageFiles"]["tmp_name"] as $key => $tmp_name) {
    $target_file = $target_dir . basename($_FILES["imageFiles"]["name"][$key]);
    if (move_uploaded_file($tmp_name, $target_file)) {
        $upload_results[] = "The file " . basename($_FILES["imageFiles"]["name"][$key]) . " has been uploaded.";
    } else {
        $upload_results[] = "Sorry, there was an error uploading your file " . basename($_FILES["imageFiles"]["name"][$key]) . ".";
    }
}

echo json_encode($upload_results);
?>
