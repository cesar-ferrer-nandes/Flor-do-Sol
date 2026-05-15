<?php
// ================= CADASTRO DE USUÁRIO =================
// Cria uma nova conta de usuário.
// Valida campos obrigatórios, email único e tamanho mínimo de senha.
// POST /api/usuarios/cadastrar.php

require_once __DIR__ . '/../config.php';

require_method('POST');
$data = get_json_input();
$nome = trim($data['nome'] ?? '');
$email = trim($data['email'] ?? '');
$senha = $data['senha'] ?? '';

if (!$nome || !$email || !$senha) {
    json_response(['erro' => 'Campos obrigatórios: nome, email, senha'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['erro' => 'Email inválido'], 400);
}

if (strlen($senha) < 6) {
    json_response(['erro' => 'Senha deve ter no mínimo 6 caracteres'], 400);
}

// Verifica se email já está em uso
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    json_response(['erro' => 'Este email já está cadastrado'], 409);
}

$hash = password_hash($senha, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)");
$stmt->execute([$nome, $email, $hash]);

json_response(['mensagem' => 'Conta criada com sucesso! Faça login para continuar.'], 201);
