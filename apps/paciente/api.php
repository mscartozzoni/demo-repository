<?php
// ========================================
// API COMPLETA - SISTEMA MÉDICO
// Serve todos os painéis: médico, secretaria, orçamentos, pacientes
// ========================================

// Carregar configurações de forma segura ANTES de qualquer output
require_once 'config.php';

// Headers HTTP
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Em produção, restrinja para os domínios corretos
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Edge-Key');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Função para conectar ao banco
function getConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASSWORD,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro de conexão com o banco de dados. Verifique as credenciais.']);
        exit();
    }
}

// Função para log de auditoria
function logAction($pdo, $userId, $action, $status, $details = null) {
    if (!ENABLE_AUDIT_LOG) return;
    try {
        $stmt = $pdo->prepare("INSERT INTO audit_log (user_id, action, status, details, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$userId, $action, $status, $details]);
    } catch (Exception $e) {
        error_log("Erro no log de auditoria: " . $e->getMessage());
    }
}

// Validar JWT Token
function validateJWT($token) {
    // Implementação simplificada - em produção use biblioteca JWT
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    
    // Decodificar payload (simplificado)
    $payload = json_decode(base64_decode($parts[1]), true);
    
    // Verificar expiração
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return false;
    }
    
    // Retornar dados do usuário
    return $payload;
}

// Verificar permissões
function hasPermission($userType, $action, $module) {
    $permissions = [
        'admin' => ['*'],
        'doctor' => [
            'budgets' => ['read', 'create', 'update'],
            'appointments' => ['read', 'create', 'update'],
            'patients' => ['read', 'create', 'update'],
            'procedures' => ['read'],
            'prescriptions' => ['read', 'create', 'update']
        ],
        'employee' => [
            'appointments' => ['read', 'create', 'update'],
            'patients' => ['read', 'create'],
            'budgets' => ['read'],
            'contacts' => ['read', 'create', 'update']
        ],
        'patient' => [
            'appointments' => ['read'],
            'budgets' => ['read'],
            'own_data' => ['read', 'update']
        ]
    ];
    
    // Admin tem acesso total
    if ($userType === 'admin') return true;
    
    // Verificar permissões específicas
    return isset($permissions[$userType][$module]) && 
           in_array($action, $permissions[$userType][$module]);
}

// Obter dados da requisição
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Remover 'api' do caminho se presente (flexibilidade)
if ($pathParts[0] === 'api') {
    array_shift($pathParts);
}

$module = $pathParts[0] ?? '';
$id = $pathParts[1] ?? null;
$action = $pathParts[2] ?? null;

// Obter dados JSON do body
$input = json_decode(file_get_contents('php://input'), true);

// Conectar ao banco
$pdo = getConnection();

// Validar autenticação (exceto para health check)
$user = null;
if ($module !== 'health') {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = str_replace('Bearer ', '', $authHeader);
    $user = validateJWT($token);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Token inválido ou expirado']);
        exit();
    }
}

// Roteamento por módulos
try {
    switch ($module) {
        
        case 'health':
            echo json_encode([
                'success' => true,
                'service' => 'Sistema Médico API Completa',
                'status' => 'healthy',
                'timestamp' => date('c'),
                'version' => '2.0.0',
                'db_status' => 'connected',
                'modules' => ['patients', 'appointments', 'budgets', 'procedures', 'prescriptions', 'contacts']
            ]);
            break;
            
        case 'schema':
            if ($method === 'GET') {
                $stmt = $pdo->prepare("SELECT table_name FROM information_schema.tables WHERE table_schema = ?");
                $stmt->execute([DB_NAME]);
                $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
                
                echo json_encode(['success' => true, 'tables' => $tables]);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Método não permitido. Use GET.']);
            }
            break;

        case 'patients':
            // Lógica do módulo de pacientes aqui...
            break;
            
        case 'appointments':
            // Lógica do módulo de agendamentos aqui...
            break;

        // ... outros módulos ...
            
        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint não encontrado']);
    }
    
} catch (Exception $e) {
    error_log("Erro na API: " . $e->getMessage());
    logAction($pdo, $user['id'] ?? null, $module, 'error', $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro interno do servidor']);
}