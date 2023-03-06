import MySqlConnection from "../core/mysqlConnection"

export class CategoryService {

    constructor () {}

    public async getCategories() {
        return new Promise ((resolve, reject) => {
            const sqlText = `
                SELECT category.category_id, category.category_name
                FROM category
                WHERE category.deleted_at IS NULL;
            `;

            MySqlConnection
                .getInstance()
                .fetch(sqlText)
                .then((data) => {
                    let res = JSON.parse(JSON.stringify(data))
                    console.log(res)
                    res && res.length ? resolve(res) : resolve(null);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    public async getCategoryById(category_id: number) {
        return new Promise ((resolve, reject) => {
            const sqlText = `
                SELECT category.category_id, category.category_name
                FROM category
                WHERE category.category_id = ${category_id} AND 
                category.deleted_at IS NULL
            `;

            MySqlConnection
                .getInstance()
                .fetch(sqlText)
                .then((data) => {
                    let res = JSON.parse(JSON.stringify(data))
                    console.log(res)
                    res && res.length ? resolve(res[0]) : resolve(null);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    public async getCategoryByName(category_name: string) {
        return new Promise ((resolve, reject) => {
            const sqlText = `
                SELECT *
                FROM category
                WHERE category.category_name = '${category_name}' AND 
                category.deleted_at IS NULL;
            `;

            MySqlConnection
                .getInstance()
                .fetch(sqlText)
                .then((data) => {
                    let res = JSON.parse(JSON.stringify(data))
                    console.log(res)
                    res && res.length ? resolve(res[0]) : resolve(null);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    public async createCategory(
        category_name: string) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                INSERT INTO category(category_name)
                VALUES ('${category_name}');
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
                    reject(error);
                })
        })
    }

    public async updateCategory(
        category_id: number,
        category_name: string) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                UPDATE category
                SET category.category_name = '${category_name}',
                category.updated_at = NOW()
                WHERE category.category_id = ${category_id} AND
                category.deleted_at IS NULL;
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
                    reject(error);
                })
        })
    }

    public async deleteCategory(
        category_id: number) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                UPDATE category
                SET category.deleted_at = NOW()
                WHERE category.category_id = ${category_id} AND
                category.deleted_at IS NULL;
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
                    reject(error);
                })
        })
    }
}