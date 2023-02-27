import MySqlConnection from "../core/mysqlConnection"
import express from 'express'
import { User } from "../models/user"

export class ProductService {

    constructor (
        // private company_id: number,
        // private user: User
    ) {}

    public async getCompanyProducts(
        company_id: number
    ) {
        return new Promise((resolve, reject) => {
            let sqlText = `
                SELECT product.price, product.name, product.description, product.available,
                product.company_id, product.collection_id, product.category_id,
                category.category_name, collection.collection_name
                FROM product, collection, category
                WHERE product.company_id = ${company_id} AND
                category.category_id = product.category_id AND
                collection.collection_id = product.collection_id AND
                product.deleted_at IS NULL AND
                category.deleted_at IS NULL AND
                collection.deleted_at IS NULL;
            `;

            MySqlConnection
                .getInstance()
                .fetch(sqlText)
                .then((data) => {
                    let res = JSON.parse(JSON.stringify(data))
                    res && res.length ? resolve(res) : resolve(null);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    public async getCollectionProducts(
        collection_id: number
    ) {
        return new Promise((resolve, reject) => {
            let sqlText = `
                SELECT product.product_id, product.name, product.price, product.company_id, product.collection_id, category_id 
                FROM product, collection
                WHERE product.collection_id = ${collection_id} AND
                product.deleted_at IS NULL;
            `;

            MySqlConnection
                .getInstance()
                .fetch(sqlText)
                .then((data) => {
                    let res = JSON.parse(JSON.stringify(data))
                    res && res.length ? resolve(res) : resolve(null);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    public async getProduct(
        product_id: number
    ) {
        return new Promise((resolve, reject) => {
            let sqlText = `
                SELECT product.product_id, product.name, product.price, product.company_id, product.collection_id, category_id 
                FROM product
                WHERE product.product_id = ${product_id} AND
                product.deleted_at IS NULL;
            `;

            MySqlConnection
                .getInstance()
                .fetch(sqlText)
                .then((data) => {
                    let res = JSON.parse(JSON.stringify(data))
                    res && res.length ? resolve(res) : resolve(null);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    public async createProduct(
        name: string,
        price: number,
        description: string = "",
        available: number,
        company_id: number,
        collection_id: number,
        category_id: number) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                INSERT INTO products(name, price, description, available, company_id, collection_id, category_id)
                VALUES ("${name}", ${price}, "${description}", ${available}, ${company_id}, ${collection_id}, ${category_id});
            `;

            MySqlConnection
                .getInstance()
                .runQuery(sqlText)
                .then((success) => {
                    if (success) {
                        resolve(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                })
        })
    }

    public async updateProduct(
        product_id: number,
        name: string,
        price: number,
        description: string,
        available: number,
        company_id: number,
        collection_id: number,
        category_id: number) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                UPDATE product
                SET product.name = "${name}"
                product.price = ${price}
                product.description = "${description}"
                product.available = ${available}
                product.company_id = ${company_id}
                product.collection_id = ${collection_id}
                product.category_id = ${category_id}
                collection.updated_at = NOW()
                WHERE product = ${product_id} AND
                product.deleted_at IS NULL;
            `;

            MySqlConnection
                .getInstance()
                .runQuery(sqlText)
                .then((success) => {
                    if (success) {
                        resolve(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                })
        })
    }

    public async deleteProduct(
        product_id: number) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                UPDATE product
                SET product.deleted_at = NOW()
                WHERE product.product_id = ${product_id} AND
                product.deleted_at IS NULL
            `;

            MySqlConnection
                .getInstance()
                .runQuery(sqlText)
                .then((success) => {
                    if (success) {
                        resolve(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                })
        })
    }
}