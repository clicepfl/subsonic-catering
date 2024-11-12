CREATE TABLE IF NOT EXISTS orders(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    amounts TEXT,
    register TEXT,
    prepared BOOLEAN DEFAULT false,
    served BOOLEAN DEFAULT false
);
CREATE TABLE IF NOT EXISTS menus(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT,
    description TEXT,
    stocks INTEGER
);
-----
INSERT INTO menus(id, name, description, stocks)
VALUES(
        0,
        'Temptation',
        'Tomates séchées, Mozza, Pesto',
        100
    ) ON CONFLICT DO NOTHING;
INSERT INTO menus(id, name, description, stocks)
VALUES(
        1,
        'Chaos',
        'Chèvre, Miel',
        100
    ) ON CONFLICT DO NOTHING;
INSERT INTO menus(id, name, description, stocks)
VALUES(
        2,
        'Oblivion',
        'Champingons, Oigions caramelisés, Pesto',
        100
    ) ON CONFLICT DO NOTHING;
INSERT INTO menus(id, name, description, stocks)
VALUES(
        3,
        'Craving',
        'Ovomaltine',
        100
    ) ON CONFLICT DO NOTHING;