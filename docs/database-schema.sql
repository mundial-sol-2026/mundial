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
    start_time INT NOT NULL, -- Unix timestamp en segundos
    status VARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, LIVE, FINISHED
    result VARCHAR(50) DEFAULT NULL, -- HOME_WIN, AWAY_WIN, DRAW
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Predicciones (Guardadas con firma criptográfica verificada)
CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    user_wallet VARCHAR(44) NOT NULL, -- Solana address (32 bytes -> 44 base58)
    match_id VARCHAR(255) REFERENCES matches(id) ON DELETE CASCADE,
    predicted_winner VARCHAR(50) NOT NULL, -- HOME, AWAY, DRAW
    is_processed BOOLEAN DEFAULT FALSE, -- Flag para evitar procesar dos veces
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_wallet, match_id) -- Una predicción por usuario y partido
);

-- 3. Tabla de Saldos y Reclamaciones (Estado financiero de cada usuario)
CREATE TABLE IF NOT EXISTS user_rewards (
    user_wallet VARCHAR(44) PRIMARY KEY,
    accumulated_tokens NUMERIC(20, 6) DEFAULT 0, -- Tokens ganados (con decimales)
    claimed_tokens NUMERIC(20, 6) DEFAULT 0, -- Tokens ya reclamados
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
-- SEED DE DATOS REALES (IDs consistentes con worldcup2026.ts)
-- ========================================
-- Partido inaugural (Grupo A): 11 de junio de 2026 a las 19:00 UTC
INSERT INTO matches (id, home_team, away_team, start_time, status)
VALUES 
    ('A1', 'México', 'Sudáfrica', 1749668400, 'SCHEDULED'),
    ('A2', 'Corea del Sur', 'Chequia', 1749679200, 'SCHEDULED'),
    ('A3', 'Sudáfrica', 'Corea del Sur', 1750089600, 'SCHEDULED'),
    ('A4', 'Chequia', 'México', 1750107600, 'SCHEDULED'),
    ('A5', 'México', 'Corea del Sur', 1750532400, 'SCHEDULED'),
    ('A6', 'Sudáfrica', 'Chequia', 1750532400, 'SCHEDULED'),
    ('B1', 'Canadá', 'Bosnia y Herzegovina', 1749733200, 'SCHEDULED'),
    ('B2', 'Qatar', 'Suiza', 1749747600, 'SCHEDULED'),
    ('I1', 'Francia', 'Senegal', 1750107600, 'SCHEDULED'),
    ('I2', 'Irak', 'Noruega', 1750118400, 'SCHEDULED'),
    ('J1', 'Argentina', 'Argelia', 1750215600, 'SCHEDULED'),
    ('J2', 'Austria', 'Jordania', 1750226400, 'SCHEDULED'),
    ('K1', 'Portugal', 'RD Congo', 1750262400, 'SCHEDULED'),
    ('K2', 'Uzbekistán', 'Colombia', 1750294800, 'SCHEDULED'),
    ('L1', 'Inglaterra', 'Croacia', 1750273200, 'SCHEDULED'),
    ('L2', 'Ghana', 'Panamá', 1750284000, 'SCHEDULED')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- FUNCIONES DE UTILIDAD
-- ========================================

-- Función para obtener balance disponible de un usuario
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
