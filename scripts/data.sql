INSERT INTO carts (id, user_id, created_at, updated_at, status)
VALUES ('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001', '2024-07-18', '2024-07-19',
        'OPEN'),
       ('123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174003', '2024-07-18', '2024-07-19',
        'ORDERED');

INSERT INTO cart_items (cart_id, product_id, count)
VALUES ('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174005', 2),
       ('123e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174006', 2);

INSERT INTO users (id, name, email, password)
VALUES ('123e4567-e89b-12d3-a456-426614174001', 'User1', 'Email1', 'Password1'),
       ('123e4567-e89b-12d3-a456-426614174003', 'User2', 'Email2', 'Password2');

INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total)
VALUES ('123e4567-e89b-12d3-a456-426614174009', '123e4567-e89b-12d3-a456-426614174007',
        '123e4567-e89b-12d3-a456-426614174000', '{"method": "credit_card", "amount": 200.00}',
        '{"address": "address1"}', 'Comment1', 'ORDERED', 200.00),
       ('123e4567-e89b-12d3-a456-426614174010', '123e4567-e89b-12d3-a456-426614174008',
        '123e4567-e89b-12d3-a456-426614174002', '{"method": "credit_card", "amount": 300.00}', '{"address": "address2"}',
        'Comment2', 'ORDERED', 300.00);