<?php
// ================= CONFIGURAÇÃO GLOBAL DA API =================
// Headers de segurança, CORS, conexão com banco e funções auxiliares.
// Incluído por todos os endpoints da API via require_once.

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://viacep.com.br; frame-src 'self' https://wa.me;");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");

// Responde preflight CORS (OPTIONS) imediatamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ================= CONEXÃO COM O BANCO =================
// Configuração via variáveis de ambiente com fallback para desenvolvimento local.

$host = getenv('DB_HOST') ?: 'localhost';
$dbname = getenv('DB_NAME') ?: 'flordosol';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASS') ?: '';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro de conexão com o banco']);
    exit;
}

// ================= FUNÇÕES AUXILIARES =================

// Retorna resposta JSON padronizada com código HTTP e encerra execução.
function json_response($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Gera token aleatório seguro para autenticação (64 caracteres hex).
function gerar_token() {
    return bin2hex(random_bytes(32));
}

// Valida se o método HTTP da requisição é o esperado.
function require_method($method) {
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        json_response(['erro' => 'Método não permitido'], 405);
    }
}

// Decodifica o corpo JSON da requisição POST/PUT.
function get_json_input() {
    return json_decode(file_get_contents('php://input'), true);
}

// Busca usuário autenticado pelo token Bearer no header Authorization.
// Retorna null se não houver token válido ou estiver expirado.
function get_auth_user($pdo) {
    $token = '';
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $token = str_replace('Bearer ', '', $_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    }
    if (!$token) return null;

    $stmt = $pdo->prepare("SELECT id, nome, email FROM usuarios WHERE token = ? AND token_expires > NOW()");
    $stmt->execute([$token]);
    return $stmt->fetch();
}

// Exige autenticação: retorna usuário ou 401.
function require_auth($pdo) {
    $user = get_auth_user($pdo);
    if (!$user) json_response(['erro' => 'Não autenticado'], 401);
    return $user;
}
