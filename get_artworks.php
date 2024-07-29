<?php
header('Content-Type: application/json');

function scanDirectory($dir) {
    $result = [];
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                $result = array_merge($result, scanDirectory($path));
            } else {
                $ext = pathinfo($path, PATHINFO_EXTENSION);
                if (in_array(strtolower($ext), ['jpg', 'jpeg', 'png', 'gif'])) {
                    $result[] = [
                        'title' => pathinfo($file, PATHINFO_FILENAME),
                        'file' => $path
                    ];
                }
            }
        }
    }
    return $result;
}

$artworks = scanDirectory('./Arts');
echo json_encode($artworks);