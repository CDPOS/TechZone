-- Script de Criação do Banco de Dados TechZone
-- Executar este script no phpMyAdmin ou no seu cliente SQL de preferência

-- 1. Cria o banco de dados se ele ainda não existir
CREATE DATABASE IF NOT EXISTS techzone DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 2. Seleciona o banco para uso
USE techzone;

-- 3. Cria a tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_cliente VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco TEXT NOT NULL,
    produtos_comprados TEXT NOT NULL, -- Armazena o JSON vindo do localStorage
    total_pago DECIMAL(10, 2) NOT NULL,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);