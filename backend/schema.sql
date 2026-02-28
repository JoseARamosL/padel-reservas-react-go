-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" SERIAL PRIMARY KEY, -- 'SERIAL' crea la secuencia automáticamente
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "role" VARCHAR(50) DEFAULT 'user',
    "name" VARCHAR(255),
    "surnames" VARCHAR(255),
    "phone" VARCHAR(20)
);

-- Tabla de Pistas
CREATE TABLE IF NOT EXISTS "public"."courts" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "court_type" VARCHAR(50),
    "price_per_hour" NUMERIC(10,2) NOT NULL
);

-- Tabla de tramos horarios
CREATE TABLE IF NOT EXISTS "public"."slots" (
    "id" SERIAL PRIMARY KEY,
    "court_id" INTEGER REFERENCES "public"."courts"("id") ON DELETE CASCADE,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL
);

-- Tabla de Reservas
CREATE TABLE IF NOT EXISTS "public"."reservations" (
    "id" SERIAL PRIMARY KEY,
    "slot_id" INTEGER REFERENCES "public"."slots"("id") ON DELETE CASCADE,
    "reservation_date" DATE NOT NULL,
    "user_id" INTEGER REFERENCES "public"."users"("id"),
    "guest_name" VARCHAR(100),
    "guest_phone" VARCHAR(20),
    "status" VARCHAR(20) DEFAULT 'confirmed',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- INDEX
CREATE INDEX IF NOT EXISTS idx_slots_court_date ON "public"."slots" ("court_id");
CREATE INDEX IF NOT EXISTS idx_reservations_slot_date ON "public"."reservations" ("slot_id", "reservation_date");