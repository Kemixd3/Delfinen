

<?php
header('Content-Type: application/json');
putenv("API_KEY=" . $_ENV['API_KEY']);
echo json_encode(['API_KEY' => $_ENV['API_KEY']]);
?>
