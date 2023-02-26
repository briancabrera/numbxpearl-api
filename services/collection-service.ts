import MySqlConnection from "../core/mysqlConnection"
import { User } from "../models/user"

export class CollectionService {

    constructor (
        // private company_id: number,
        // private user: User
    ) {}

    public async getCompanyCollections(
        company_id: number
    ) {
        return new Promise((resolve, reject) => {
            let sqlText = `
                SELECT collection.collection_id, collection.collection_name, collection.available
                FROM collection
                WHERE collection.company_id = ${company_id} AND
                collection.deleted_at IS NULL;
            `;

            // TODO!!!
            // AGREGAR PRODUCTOS A DE LOS DROPS

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

    public async getCollection(
        collection_id: number
    ) {
        return new Promise((resolve, reject) => {
            let sqlText = `
                SELECT collection.collection_id, collection.collection_name, collection.available
                FROM collection
                WHERE collection.company_id = ${collection_id} AND
                collection.deleted_at IS NULL;
            `;

            // TODO!!!
            // AGREGAR PRODUCTOS A DE LOS DROPS

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

    private async getCollectionProducts(
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

    public async createCollection(
        collection_name: string,
        available: number,
        company_id: number) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                INSERT INTO collection(collection_name, available, company_id)
                VALUES ("${collection_name}", ${available}, ${company_id});
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

    public async updateCollection(
        collection_id: number,
        collection_name: string,
        available: number) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                UPDATE collection
                SET collection.collection_name = "${collection_name}"
                collection.available = ${available}
                collection.updated_at = NOW()
                WHERE collection.collection_id = ${collection_id} AND
                collection.deleted_at IS NULL
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

    public async deleteCollection(
        collection_id: number) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                UPDATE collection
                SET collection.deleted_at = NOW()
                WHERE collection.collection_id = ${collection_id} AND
                collection.deleted_at IS NULL
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