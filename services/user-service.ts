import MySqlConnection from "../core/mysqlConnection"
import { User } from "../models/user"

export class UserService {

    constructor (
    ) {}

    public async getUsers() {
        return new Promise ((resolve, reject) => {
            const sqlText = `
                SELECT *
                FROM users
                WHERE users.deleted_at IS NULL;
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

    public async createUser(
        firstname: string,
        lastname: string,
        email: string,
        phone: string,
        document: string) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                INSERT INTO users(firstname, lastname, email, phone, document)
                VALUES ('${firstname}', '${lastname}', '${email}', '${phone}', '${document}');
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

    // TODO !!
    public updateUser(req, res) {
        return 1
    }

    public deleteUser(req, res) {
        return 1
    }

    public async getUserRole(user_id: number) {
        return new Promise ((resolve, reject) => {
            const sqlText = `
                SELECT user_type_name
                FROM users, user_type
                WHERE users.user_id = ${user_id} AND
                users.user_type_id = user_type.user_type_id AND
                users.deleted_at IS NULL;
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

    public async getUserByDocument(document: string) {
        return new Promise ((resolve, reject) => {
            const sqlText = `
                SELECT user_id, firstname, lastname, email, phone, document
                FROM users
                WHERE users.document = '${document}' AND
                users.deleted_at IS NULL;
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

    public async getUserById(user_id: number) {
        return new Promise ((resolve, reject) => {
            const sqlText = `
                SELECT user_id, firstname, lastname, email, phone, document
                FROM users
                WHERE users.user_id = ${user_id} AND
                users.deleted_at IS NULL;
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

    public async getUserAddresses(
        user_id: number
    ) {
        return new Promise((resolve, reject) => {
            let sqlText = `
                SELECT address.address_id, address.address, address.country_id, address.department_id,
                country.country_name, department.department_name
                FROM address, country, department
                WHERE address.user_id = ${user_id} AND
                country.country_id = address.country_id AND
                department.department_id = address.address_id AND
                address.deleted_at IS NULL;
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

    public async createUserAddress(
        country_id: number,
        department_id: number,
        address: string,
        user_id: number) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                INSERT INTO address(country_id, department_id, address, user_id)
                VALUES (${country_id}, ${department_id}, '${address}', ${user_id});
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

    public async updateUserAddress(
        address_id: number,
        country_id: number,
        department_id: number,
        address: string) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                UPDATE address
                SET address.department_id = ${department_id},
                address.address = '${address}',
                address.updated_at = NOW()
                WHERE address.address_id = ${address_id} AND
                address.deleted_at IS NULL;
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

    public async deleteUserAddress(
        address_id: number) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                UPDATE address
                SET address.deleted_at = NOW()
                WHERE address.address_id = ${address_id} AND
                address.deleted_at IS NULL;
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