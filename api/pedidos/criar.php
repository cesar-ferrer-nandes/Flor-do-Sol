<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['erro' => 'Método não permitido'], 405);
}

$user = require_auth($pdo);
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['itens'])) {
    json_response(['erro' => 'Pedido sem itens'], 400);
}

$total = (float)($data['total'] ?? 0);
$frete = (float)($data['frete'] ?? 0);

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare("INSERT INTO pedidos (usuario_id, total, frete) VALUES (?, ?, ?)");
    $stmt->execute([$user['id'], $total, $frete]);
    $pedido_id = (int)$pdo->lastInsertId();

    $stmt_item = $pdo->prepare(
        "INSERT INTO itens_pedido (pedido_id, produto_id, nome_produto, quantidade, preco_unitario, personalizacao)
         VALUES (?, ?, ?, ?, ?, ?)"
    );

    foreach ($data['itens'] as $item) {
        $personalizacao = !empty($item['personalizacao']) ? json_encode($item['personalizacao']) : null;
        $stmt_item->execute([
            $pedido_id,
            $item['produto_id'] ?? null,
            $item['nome'],
            (int)($item['quantidade'] ?? 1),
            (float)($item['preco_unitario'] ?? 0),
            $personalizacao,
        ]);
    }

    if (!empty($data['entrega'])) {
        $e = $data['entrega'];
        $stmt_ent = $pdo->prepare(
            "INSERT INTO entregas (pedido_id, nome, cep, logradouro, numero, complemento, bairro, cidade)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt_ent->execute([
            $pedido_id,
            $e['nome'],
            $e['cep'],
            $e['rua'],
            $e['numero'],
            $e['complemento'] ?? '',
            $e['bairro'],
            $e['cidade'],
        ]);
    }

    $pdo->commit();
    json_response(['mensagem' => 'Pedido criado com sucesso!', 'pedido_id' => $pedido_id]);
} catch (Exception $e) {
    $pdo->rollBack();
    json_response(['erro' => 'Erro ao criar pedido'], 500);
}
