import MySqlConnection from "../core/mysqlConnection"
import { User } from "../models/user"

export class UserService {

    constructor (
        // private company_id: number,
        // private user: User
    ) {}

    public getUsers(req, res) {
        return 1
    }

    public getUser(req, res) {
        return 1
    }

    public createUser(req, res) {
        return 1
    }

    public updateUser(req, res) {
        return 1
    }

    public deleteUser(req, res) {
        return 1
    }

    public async getUserRole(user_id: number): Promise<string> {
        return new Promise ((resolve, reject) => {
                const sqlText = `
                SELECT user_type_name
                FROM users, user_type
                WHERE users.user_id = ${user_id} AND
                users.user_type_id = user_type.user_type_id
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
}