<?php
// ========================================
// CONFIGURAÇÕES DA API COMPLETA
// Sistema Médico - Todos os Módulos
// ========================================

// Função para carregar variáveis de ambiente de um arquivo .env
function loadEnv($path)
{
    if (!file_exists($path)) {
        throw new Exception("O arquivo .env não foi encontrado em: {$path}");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        // Remove aspas do valor, se existirem
        if (substr($value, 0, 1) == '"' && substr($value, -1) == '"') {
            $value = substr($value, 1, -1);
        }

        putenv(sprintf('%s=%s', $name, $value));
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
    }
}

// Carrega o arquivo .env da raiz do projeto
loadEnv(__DIR__ . '/.env');

// Função auxiliar para buscar variáveis de ambiente
function getEnvVar($key, $default = null)
{
    return $_ENV[$key] ?? getenv($key) ?: $default;
}

// Configurações do banco de dados Hostinger (lidas do .env)
define('DB_HOST', getEnvVar('DB_HOST', 'localhost'));
define('DB_PORT', getEnvVar('DB_PORT', '3306'));
define('DB_NAME', getEnvVar('DB_NAME'));
define('DB_USER', getEnvVar('DB_USER'));
define('DB_PASSWORD', getEnvVar('DB_PASSWORD'));

// Chaves de segurança (lidas do .env)
define('API_SECRET_KEY', getEnvVar('API_SECRET_KEY'));
define('JWT_SECRET', getEnvVar('JWT_SECRET'));
define('EDGE_FUNCTION_KEY', getEnvVar('EDGE_FUNCTION_KEY'));

// Configurações gerais
define('ENVIRONMENT', getEnvVar('ENVIRONMENT', 'production'));
define('ENABLE_AUDIT_LOG', getEnvVar('ENABLE_AUDIT_LOG', true));

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// Error reporting baseado no ambiente
if (ENVIRONMENT === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}