<?php
// ================= API DE PRODUTOS =================
// Retorna a lista de produtos ou um produto específico pelo ID.
// GET /api/produtos.php       → todos os produtos
// GET /api/produtos.php?id=5  → produto com ID 5

require_once __DIR__ . '/config.php';

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

require_method('GET');

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id) {
    $stmt = $pdo->prepare("SELECT * FROM produtos WHERE id = ?");
    $stmt->execute([$id]);
    $produto = $stmt->fetch();
    if (!$produto) json_response(['erro' => 'Produto não encontrado'], 404);
    $produto['preco'] = (float)$produto['preco'];
    json_response($produto);
} else {
    $stmt = $pdo->query("SELECT * FROM produtos ORDER BY id ASC");
    $produtos = $stmt->fetchAll();
    foreach ($produtos as &$p) {
        $p['preco'] = (float)$p['preco'];
    }
    json_response($produtos);
}
