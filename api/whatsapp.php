<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['erro' => 'Método não permitido'], 405);
}

$stmt = $pdo->prepare("SELECT valor FROM config WHERE chave = 'whatsapp_number'");
$stmt->execute();
$row = $stmt->fetch();

$numero = $row ? $row['valor'] : '5511999999999';
json_response(['numero' => $numero]);
