-- Saint X — Schema inicial (ambiente de teste)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('cliente', 'vendedor', 'admin');
CREATE TYPE kyc_status AS ENUM ('pendente', 'em_analise', 'aprovado', 'rejeitado');
CREATE TYPE document_type AS ENUM ('CPF', 'CNPJ');
CREATE TYPE product_status AS ENUM ('rascunho', 'ativo', 'pausado', 'removido');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  last_login_at TIMESTAMP
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  phone VARCHAR(20),
  birth_date DATE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label VARCHAR(50),
  street VARCHAR(255),
  number VARCHAR(20),
  complement VARCHAR(255),
  neighborhood VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  is_default BOOLEAN DEFAULT FALSE
);

CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_name VARCHAR(255) NOT NULL,
  document_type document_type NOT NULL,
  document_number VARCHAR(20) UNIQUE NOT NULL,
  kyc_status kyc_status DEFAULT 'pendente',
  id_document_url TEXT,
  proof_of_address_url TEXT,
  selfie_with_document_url TEXT,
  bank_account_holder VARCHAR(255),
  bank_name VARCHAR(255),
  bank_agency VARCHAR(20),
  bank_account_number VARCHAR(30),
  can_use_3d_generation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  approved_at TIMESTAMP
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  category VARCHAR(100),
  status product_status DEFAULT 'rascunho',
  model_3d_url TEXT,
  default_color_hex VARCHAR(7),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE product_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_hex VARCHAR(7) NOT NULL,
  color_name VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_cover BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0
);

-- Índices úteis para consultas frequentes
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_sellers_kyc_status ON sellers(kyc_status);
CREATE INDEX idx_customers_user ON customers(user_id);
