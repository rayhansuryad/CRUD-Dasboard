create DATABASE product_dasboard;

USE product_dasboard;

create table products (
	id 			INT AUTO_INCREMENT PRIMARY KEY,
    name 		Varchar(150) NOT NULL,
    description TEXT,
    price 		decimal(12,2) not null default 0,
    stock 		INT not null default 0,
    createdAT	timestamp default current_timestamp
);

insert into products 
	(name, description, price, stock)
    VALUES 
    ('Kaos Basic', 'Kaos Catton Combed 24s,', 75000, 20),
    ('Hoodie Casual', 'Hoodie untuk penggunaan sehari-hari', 150000, 10),
    ('Topi Outdoor', 'Topi Untuk aktivitas luar ruangan', 45000,15);
    
select * from products;
    
    