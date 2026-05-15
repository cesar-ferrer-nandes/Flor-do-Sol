<?php
// ================= API DO WHATSAPP =================
// Retorna o número de WhatsApp configurado no banco de dados.
// O frontend usa este número para abrir o link direto do pedido.
// GET /api/whatsapp.php → {"numero": "5511999999999"}

require_once __DIR__ . '/config.php';

require_method('GET');

$stmt = $pdo->prepare("SELECT valor FROM config WHERE chave = 'whatsapp_number'");
$stmt->execute();
$row = $stmt->fetch();

$numero = $row ? $row['valor'] : '5511999999999';
json_response(['numero' => $numero]);
