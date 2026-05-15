<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['erro' => 'Método não permitido'], 405);
}

$user = require_auth($pdo);

$stmt = $pdo->prepare(
    "SELECT p.*,
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', ip.id,
                    'nome', ip.nome_produto,
                    'quantidade', ip.quantidade,
                    'preco_unitario', ip.preco_unitario,
                    'personalizacao', ip.personalizacao
                )
            ) FROM itens_pedido ip WHERE ip.pedido_id = p.id) AS itens,
            (SELECT JSON_OBJECT(
                'nome', e.nome,
                'cep', e.cep,
                'logradouro', e.logradouro,
                'numero', e.numero,
                'bairro', e.bairro,
                'cidade', e.cidade
            ) FROM entregas e WHERE e.pedido_id = p.id) AS entrega
     FROM pedidos p
     WHERE p.usuario_id = ?
     ORDER BY p.created_at DESC"
);
$stmt->execute([$user['id']]);
$pedidos = $stmt->fetchAll();

foreach ($pedidos as &$p) {
    $p['total'] = (float)$p['total'];
    $p['frete'] = (float)$p['frete'];
    $p['itens'] = $p['itens'] ? json_decode($p['itens'], true) : [];
    $p['entrega'] = $p['entrega'] ? json_decode($p['entrega'], true) : null;
}

json_response($pedidos);
