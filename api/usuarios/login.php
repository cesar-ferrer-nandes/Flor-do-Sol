<?php
// ================= LOGIN DE USUÁRIO =================
// Autentica o usuário com email e senha.
// Inclui proteção contra força bruta (5 tentativas por IP em 5 minutos).
// Retorna token JWT com validade de 30 dias.
// POST /api/usuarios/login.php

require_once __DIR__ . '/../config.php';

require_method('POST');
$data = get_json_input();
$email = trim($data['email'] ?? '');
$senha = $data['senha'] ?? '';

if (!$email || !$senha) {
    json_response(['erro' => 'Informe email e senha'], 400);
}

// Rate limiting por IP (arquivo temporário)
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$cache_key = 'login_attempts_' . md5($ip);
$attempts_file = sys_get_temp_dir() . '/' . $cache_key;
$max_attempts = 5;
$window = 300; // 5 minutos
$data_attempts = ['count' => 0, 'time' => time()];
if (file_exists($attempts_file)) {
    $saved = json_decode(file_get_contents($attempts_file), true);
    if ($saved && $saved['time'] > time() - $window) {
        $data_attempts = $saved;
        if ($data_attempts['count'] >= $max_attempts) {
            json_response(['erro' => 'Muitas tentativas. Aguarde 5 minutos.'], 429);
        }
    }
}

$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($senha, $user['senha_hash'])) {
    // Registra tentativa falha
    $data_attempts = ['count' => ($data_attempts['count'] ?? 0) + 1, 'time' => time()];
    file_put_contents($attempts_file, json_encode($data_attempts));
    json_response(['erro' => 'Email ou senha inválidos'], 401);
}

// Login bem-sucedido: limpa tentativas e gera novo token
if (file_exists($attempts_file)) unlink($attempts_file);
$token = gerar_token();
$expires = date('Y-m-d H:i:s', time() + 86400 * 30);

$stmt = $pdo->prepare("UPDATE usuarios SET token = ?, token_expires = ? WHERE id = ?");
$stmt->execute([$token, $expires, $user['id']]);

json_response([
    'token' => $token,
    'usuario' => [
        'id' => (int)$user['id'],
        'nome' => $user['nome'],
        'email' => $user['email'],
    ],
]);
