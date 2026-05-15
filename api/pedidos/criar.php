<?php
// ================= CRIAR PEDIDO =================
// Cria um novo pedido no banco de dados.
// Calcula o total somando preço * quantidade de cada item.
// Usa cache de preços para evitar consultas repetidas ao banco.
// Se houver endereço de entrega, salva na tabela entregas.
// POST /api/pedidos/criar.php (requer autenticação)

require_once __DIR__ . '/../config.php';

require_method('POST');
$user = require_auth($pdo);
$data = get_json_input();

if (empty($data['itens'])) {
    json_response(['erro' => 'Pedido sem itens'], 400);
}

$frete = (float)($data['frete'] ?? 0);

$pdo->beginTransaction();
try {
    // Primeiro loop: calcula o total com cache de preços por produto
    $totalCalculado = 0;
    $precos_cache = [];
    $stmt_preco = $pdo->prepare("SELECT id, preco FROM produtos WHERE id = ?");

    foreach ($data['itens'] as &$item) {
        $produto_id = $item['produto_id'] ?? null;
        if ($produto_id && !isset($precos_cache[$produto_id])) {
            $stmt_preco->execute([$produto_id]);
            $produto_db = $stmt_preco->fetch();
            $precos_cache[$produto_id] = $produto_db ? (float)$produto_db['preco'] : null;
        }
        $preco_unitario = ($produto_id && isset($precos_cache[$produto_id])) ? $precos_cache[$produto_id] : (float)($item['preco_unitario'] ?? 0);
        $quantidade = (int)($item['quantidade'] ?? 1);
        $totalCalculado += $preco_unitario * $quantidade;
    }
    unset($item);

    // Insere o pedido (cabeçalho) para obter o ID
    $stmt = $pdo->prepare("INSERT INTO pedidos (usuario_id, total, frete) VALUES (?, ?, ?)");
    $stmt->execute([$user['id'], $totalCalculado, $frete]);
    $pedido_id = (int)$pdo->lastInsertId();

    // Segundo loop: insere cada item (usa preços do cache)
    $stmt_item = $pdo->prepare(
        "INSERT INTO itens_pedido (pedido_id, produto_id, nome_produto, quantidade, preco_unitario, personalizacao)
         VALUES (?, ?, ?, ?, ?, ?)"
    );

    foreach ($data['itens'] as $item) {
        $produto_id = $item['produto_id'] ?? null;
        $preco_unitario = ($produto_id && isset($precos_cache[$produto_id])) ? $precos_cache[$produto_id] : (float)($item['preco_unitario'] ?? 0);
        $stmt_item->execute([
            $pedido_id,
            $produto_id,
            mb_substr(trim($item['nome'] ?? ''), 0, 100),
            (int)($item['quantidade'] ?? 1),
            $preco_unitario,
            !empty($item['personalizacao']) ? json_encode($item['personalizacao']) : null,
        ]);
    }

    // Salva endereço de entrega se informado
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
