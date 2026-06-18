CREATE TABLE IF NOT EXISTS ticket_orders (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    movie TEXT,
    session_time TEXT,
    seats INTEGER DEFAULT 1,
    comment TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);