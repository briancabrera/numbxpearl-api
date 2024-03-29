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
                SELECT product.product_id, product.name, product.price, product.company_id, product.collection_id, product.category_id 
                FROM product
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
        try {
            let sqlText = `
                SELECT product.product_id, product.name, product.price, product.company_id, product.collection_id, category_id 
                FROM product
                WHERE product.product_id = ${product_id} AND
                product.deleted_at IS NULL;
            `;

            let product = await MySqlConnection   
                .getInstance()
                .fetch(sqlText)
                .then((data) => JSON.parse(JSON.stringify(data))[0]);

            if (product) {
                product.variants = await this.getProductVariants(product_id)
            }

            return product
        } catch (err) {
            console.log(err)
            return null
        }
    }

    public async getVariantWithProduct(
        product_id: number,
        color: string,
        size: string
    ) {
        return new Promise((resolve, reject) => {
            let sqlText = `
                SELECT product.product_id, product.name, product.price, product.company_id, product.collection_id, category_id,
                product_variant.variant_id, product_variant.color, product_variant.size
                FROM product, product_variant
                WHERE product.product_id = ${product_id} AND
                product_variant.product_id = ${product_id} AND
                product_variant.size = '${size}' AND
                product_variant.color = '${color}' AND
                product_variant.deleted_at IS NULL AND
                product.deleted_at IS NULL;
            `;

            MySqlConnection
                .getInstance()
                .fetch(sqlText)
                .then((data) => {
                    let res = JSON.parse(JSON.stringify(data))
                    res && res.length ? resolve(res[0]) : resolve(null);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    private async getProductVariants(
        product_id: number,
    ) {
        try {
            let sqlText = `
                    SELECT product_variant.variant_id, product_variant.color, product_variant.size
                    FROM product_variant
                    WHERE product_variant.product_id = ${product_id} AND
                    product_variant.deleted_at IS NULL;
                `
            let variants = await MySqlConnection   
                .getInstance()
                .fetch(sqlText)
                .then((data) => JSON.parse(JSON.stringify(data)));

            return variants
        } catch (err) {
            console.log(err)
            return null
        }
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
                INSERT INTO product(name, price, description, available, company_id, collection_id, category_id)
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

    public async createProductVariants(
        product_id: number,
        colors: string[],
        sizes: string[]) {
        try {
            for (let i = 0; i < colors.length; i++) {
                for (let j = 0; j < sizes.length; j++) {
                    await this.createProductVariant(product_id, colors[i], sizes[j])
                }
            }
            return true
        } catch(err) {
            console.log(err)
            return null
        }
    }

    public async createProductVariant(
        product_id: number,
        color: string,
        size: string) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                INSERT INTO product_variant(product_id, color, size)
                VALUES (${product_id}, "${color}", "${size}");
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
                SET product.name = "${name}",
                product.price = ${price},
                product.description = "${description}",
                product.available = ${available},
                product.company_id = ${company_id},
                product.collection_id = ${collection_id},
                product.category_id = ${category_id},
                product.updated_at = NOW()
                WHERE product.product_id = ${product_id} AND
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

    public async deleteProductVariant(
        product_id: number,
        color: string,
        size: string) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                UPDATE product_variant
                SET product_variant.deleted_at = NOW()
                WHERE product_variant.product_id = ${product_id} AND
                product_variant.color = "${color}" AND
                product_variant.size = "${size}" AND
                product_variant.deleted_at IS NULL;
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