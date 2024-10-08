CREATE TYPE cart_status AS ENUM ('OPEN', 'ORDERED');

CREATE TABLE carts (
                       id UUID PRIMARY KEY,
                       user_id UUID NOT NULL,
                       created_at DATE NOT NULL,
                       updated_at DATE NOT NULL,
                       status cart_status NOT NULL
);

CREATE TABLE cart_items (
                            cart_id UUID REFERENCES carts(id),
                            product_id UUID,
                            count INTEGER,
                            PRIMARY KEY (cart_id, product_id)
);

CREATE TABLE orders (
                        id UUID PRIMARY KEY,
                        user_id UUID,
                        cart_id UUID REFERENCES carts(id),
                        payment JSON,
                        delivery JSON,
                        comments TEXT,
                        status TEXT,
                        total NUMERIC
);

CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       name TEXT NOT NULL,
                       email TEXT,
                       password TEXT NOT NULL
);