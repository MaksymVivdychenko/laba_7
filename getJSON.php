<?php
// Встановлення заголовків для відповіді
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // Шлях до JSON-файлу
    $filePath = 'events.json';

    // Перевірка, чи існує файл
    if (!file_exists($filePath)) {
        http_response_code(404);
        echo json_encode(['error' => 'File not found']);
        exit;
    }

    // Зчитування вмісту файлу
    $jsonData = file_get_contents($filePath);

    // Перевірка на помилки при зчитуванні
    if ($jsonData === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to read the file']);
        exit;
    }

    // Перевірка, чи є файл валідним JSON
    $decodedData = json_decode($jsonData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(500);
        echo json_encode(['error' => 'Invalid JSON format']);
        exit;
    }

    // Повернення JSON-вмісту клієнту
    echo json_encode($decodedData);

} catch (Exception $e) {
    // Обробка винятків
    http_response_code(500);
    echo json_encode(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()]);
}
?>