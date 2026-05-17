<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['erro' => 'Método não permitido'], 405);
}

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
