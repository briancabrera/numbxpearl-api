/*
	TABLE CREATION
*/

CREATE DATABASE numbxpearl;

USE numbxpearl;

CREATE TABLE IF NOT EXISTS company (
	company_id INT NOT NULL AUTO_INCREMENT UNIQUE,
	company_name VARCHAR(32) NOT NULL,
    created_at DATETIME DEFAULT NOW(),
	updated_at DATETIME,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS collection (
	collection_id INT NOT NULL AUTO_INCREMENT UNIQUE,
	collection_name VARCHAR(32) NOT NULL,
    available INT NOT NULL CHECK (available BETWEEN 0 AND 1),
	company_id INT NOT NULL,
    created_at DATETIME DEFAULT NOW(),
	updated_at DATETIME,
    deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS category (
	category_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    category_name VARCHAR(32) NOT NULL,
    created_at DATETIME DEFAULT NOW(),
	updated_at DATETIME DEFAULT NULL,
    deleted_at DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS collection_categories (
	category_id INT NOT NULL,
    collection_id INT NOT NULL,
    created_at DATETIME DEFAULT NOW(),
	updated_at DATETIME DEFAULT NULL,
    deleted_at DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS product (
	product_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    name VARCHAR(64) NOT NULL,
    price INT NOT NULL,
    description VARCHAR(128) DEFAULT NULL,
    available INT NOT NULL CHECK (available BETWEEN 0 AND 1),
    company_id INT NOT NULL,
    collection_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at DATETIME DEFAULT NOW(),
	updated_at DATETIME DEFAULT NULL,
    deleted_at DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS product_variant (
	variant_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    color VARCHAR(15) NOT NULL,
    size VARCHAR(3) NOT NULL,
    product_id INT NOT NULL,
    created_at DATETIME DEFAULT NOW(),
	updated_at DATETIME DEFAULT NULL,
    deleted_at DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS purchase_order (
	order_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    status VARCHAR(9) NOT NULL,
    mp_reference VARCHAR(64) NOT NULL,
    payment_id VARCHAR(64) DEFAULT NULL,
    amount INT NOT NULL,
    user_id INT NOT NULL,
    address_id INT NOT NULL,
    company_id INT NOT NULL,
    coupon_id INT DEFAULT NULL,
    created_at DATETIME DEFAULT NOW(),
	updated_at DATETIME DEFAULT NULL,
    deleted_at DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS order_products (
	order_id INT NOT NULL,
    variant_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS discount_coupon (
	coupon_id INT NOT NULL AUTO_INCREMENT UNIQUE,
	coupon_code VARCHAR(20) NOT NULL, 
	percentage INT NOT NULL,
	valid_until DATE,
	is_active INT NOT NULL CHECK (is_active BETWEEN 0 AND 1),
    uses INT NOT NULL,
	created_at DATETIME DEFAULT NOW(),
	updated_at DATETIME DEFAULT NULL,
    deleted_at DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS user_type (
	user_type_id INT NOT NULL AUTO_INCREMENT UNIQUE,
	user_type_name VARCHAR(15) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
	user_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    user_type_id INT NOT NULL DEFAULT 3,
    firstname VARCHAR(12) NOT NULL,
    lastname VARCHAR(32) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(9) NOT NULL,
    password VARCHAR(64) DEFAULT NULL,
    document VARCHAR(8) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT NOW(),
	updated_at DATETIME DEFAULT NULL,
    deleted_at DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS address (
	address_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    country_id VARCHAR(2) NOT NULL,
    department_id VARCHAR(2) NOT NULL,
    address VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT NOW(),
	updated_at DATETIME DEFAULT NULL,
    deleted_at DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS country (
	country_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    country_name VARCHAR(20) NOT NULL,
    country_code VARCHAR(2) NOT NULL
);

CREATE TABLE IF NOT EXISTS department (
	department_id INT NOT NULL AUTO_INCREMENT UNIQUE,
	country_id INT NOT NULL,
    department_name VARCHAR(32),
    department_code CHAR(2)
);

INSERT INTO company (company_name) VALUES 
	("Numb"),
    ("Pearl");

INSERT INTO user_type (user_type_name) VALUES 
	("SUPERADMIN"),
    ("ADMINISTRATOR"),
    ("CUSTOMER");
    
INSERT INTO users(user_type_id, firstname, lastname, email, phone, password, document) 
VALUES (1, "Brian", "Cabrera", "briancabrera.dev@gmail", "092730202","contraseñafalsa123", "52505507");

INSERT INTO country(country_name, country_code)
VALUES ('Uruguay', 'UY');

INSERT INTO department(country_id, department_name, department_code)
VALUES (1, 'Artigas', 'AR'),
(1, 'Canelones', 'CA'),
(1, 'Cerro Largo', 'CL'),
(1, 'Colonia', 'CO'),
(1, 'Durazno', 'DU'),
(1, 'Flores', 'FS'),
(1, 'Florida', 'FD'),
(1, 'Lavalleja', 'LA'),
(1, 'Maldonado', 'MA'),
(1, 'Montevideo', 'MO'),
(1, 'Paysandú', 'PA'),
(1, 'Río Negro', 'RN'),
(1, 'Rivera', 'RV'),
(1, 'Rocha', 'RO'),
(1, 'Salto', 'SA'),
(1, 'San José', 'SJ'),
(1, 'Soriano', 'SO'),
(1, 'Tacuarembó', 'TA'),
(1, 'Treinta y Tres', 'TT');