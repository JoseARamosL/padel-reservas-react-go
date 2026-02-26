-- Tabla de Usuarios
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash TEXT NOT NULL,
                       role VARCHAR(50) DEFAULT 'user', -- 'admin' o 'user'
                       name VARCHAR(255),
                       phone VARCHAR(20)
);

-- Tabla de Pistas
CREATE TABLE courts (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        court_type VARCHAR(50), -- 'Cristal', 'Muro'
                        price_per_hour DECIMAL(10, 2) NOT NULL
);

-- Tabla de Reservas
CREATE TABLE reservations (
                              id SERIAL PRIMARY KEY,
                              court_id INTEGER REFERENCES courts(id),
                              user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Puede ser NULL si es invitado
                              guest_name VARCHAR(255),
                              guest_phone VARCHAR(20),
                              start_time TIMESTAMP NOT NULL,
                              end_time TIMESTAMP NOT NULL,
                              status VARCHAR(20) DEFAULT 'confirmed' -- 'confirmed', 'cancelled'
);