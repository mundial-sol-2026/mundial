-- ========================================
-- SCHEMA DE BASE DE DATOS - Vercel Postgres
-- ========================================
-- Ejecuta este SQL en la consola de Vercel Postgres
-- Crea las tablas necesarias para MundialPrize2026

-- 1. Tabla de Partidos del Mundial
CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(255) PRIMARY KEY,
    home_team VARCHAR(100) NOT NULL,
    away_team VARCHAR(100) NOT NULL,
    start_time INT NOT NULL,  -- Unix timestamp en segundos
    status VARCHAR(50) DEFAULT 'SCHEDULED',  -- SCHEDULED, LIVE, FINISHED
    result VARCHAR(50) DEFAULT NULL,  -- HOME_WIN, AWAY_WIN, DRAW
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Predicciones (Guardadas con firma criptográfica verificada)
CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    user_wallet VARCHAR(44) NOT NULL,  -- Solana address (32 bytes -> 44 base58)
    match_id VARCHAR(255) REFERENCES matches(id) ON DELETE CASCADE,
    predicted_winner VARCHAR(50) NOT NULL,  -- HOME, AWAY, DRAW
    is_processed BOOLEAN DEFAULT FALSE,  -- Flag para evitar procesar dos veces
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_wallet, match_id)  -- Una predicción por usuario y partido
);

-- 3. Tabla de Saldos y Reclamaciones (Estado financiero de cada usuario)
CREATE TABLE IF NOT EXISTS user_rewards (
    user_wallet VARCHAR(44) PRIMARY KEY,
    accumulated_tokens NUMERIC(20, 6) DEFAULT 0,  -- Tokens ganados (con decimales)
    claimed_tokens NUMERIC(20, 6) DEFAULT 0,  -- Tokens ya reclamados
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ÍNDICES para Optimización de Queries
-- ========================================
CREATE INDEX idx_predictions_wallet ON predictions(user_wallet);
CREATE INDEX idx_predictions_match ON predictions(match_id);
CREATE INDEX idx_predictions_processed ON predictions(is_processed);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_start_time ON matches(start_time);

-- ========================================
-- INSERT DE DATOS DE PRUEBA
-- ========================================
-- Partido inaugural (Ejemplo: 11 de junio de 2026 a las 17:00 UTC)
INSERT INTO matches (id, home_team, away_team, start_time, status)
VALUES (
    'match_inaugural_2026',
    'Mexico',
    'Canada',
    1781222400,  -- Unix timestamp para 2026-06-11 17:00:00 UTC
    'SCHEDULED'
)
ON CONFLICT (id) DO NOTHING;

-- Segundo partido de ejemplo
INSERT INTO matches (id, home_team, away_team, start_time, status)
VALUES (
    'match_opening_game',
    'Argentina',
    'France',
    1781236800,  -- Unix timestamp para 2026-06-12 21:00:00 UTC
    'SCHEDULED'
)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- FUNCIONES DE UTILIDAD (Opcional pero recomendado)
-- ========================================

-- Función para obtener balance disponible de un usuario
-- SELECT * FROM get_user_balance('7xLkUFdzGL1UdvCqJZwpGvJNJ1fEqGBKhA...wallet_address...');
CREATE OR REPLACE FUNCTION get_user_balance(wallet_address VARCHAR(44))
RETURNS TABLE(accumulated NUMERIC, claimed NUMERIC, available NUMERIC) AS $$
SELECT 
    accumulated_tokens,
    claimed_tokens,
    accumulated_tokens - claimed_tokens as available
FROM user_rewards
WHERE user_wallet = wallet_address;
$$ LANGUAGE SQL;

-- Función para listar predicciones correctas (antes del settlement)
CREATE OR REPLACE FUNCTION get_winning_predictions(match_id_param VARCHAR(255))
RETURNS TABLE(user_wallet VARCHAR(44), predicted_winner VARCHAR(50)) AS $$
SELECT p.user_wallet, p.predicted_winner
FROM predictions p
JOIN matches m ON p.match_id = m.id
WHERE p.match_id = match_id_param
AND p.is_processed = FALSE
AND m.result = p.predicted_winner;
$$ LANGUAGE SQL;
