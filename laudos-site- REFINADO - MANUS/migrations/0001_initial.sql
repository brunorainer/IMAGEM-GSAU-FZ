-- Inicialização do banco de dados para o sistema de laudos médicos

-- Tabela de usuários administradores
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Tabela de laudos
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_name TEXT NOT NULL,
  exam_date TIMESTAMP NOT NULL,
  exam_type TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  drive_file_id TEXT,
  drive_file_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  created_by INTEGER,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabela de códigos de acesso
CREATE TABLE IF NOT EXISTS access_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  report_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  last_access TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES reports(id)
);

-- Tabela de logs de acesso
CREATE TABLE IF NOT EXISTS access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  access_code_id INTEGER NOT NULL,
  accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT,
  FOREIGN KEY (access_code_id) REFERENCES access_codes(id)
);

-- Inserir um usuário administrador padrão (senha: admin123)
INSERT INTO users (email, password, name) 
VALUES ('admin@example.com', '$2a$12$tH8HZOaZOp5hJ3NX0oqXW.KU.XG9hHnU3DDownTRGjrjFNr4g0N.C', 'Administrador');
