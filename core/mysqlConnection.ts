import mysql from 'mysql';
import { MysqlError } from 'mysql';
import { mySqlConfig } from '../config/mysqlConfig'

class MySqlConnection {
    private static _instance : MySqlConnection;
    private pool: mysql.Pool

    private constructor() {
        console.log(mySqlConfig)
        this.pool = mysql.createPool({
            host: mySqlConfig.HOST,
            user: mySqlConfig.USER,
            password: mySqlConfig.PASSWORD,
            database: mySqlConfig.DATABASE,
            connectionLimit: 100,
            connectTimeout: 60 * 60 * 1000,
            acquireTimeout: 60 * 60 * 1000,
            timeout : 60 * 60 * 1000,
        });
    }

    static getInstance() {
        if (!MySqlConnection._instance) {
            MySqlConnection._instance = new MySqlConnection()
        }
        
        return MySqlConnection._instance;
    }

    fetch(query: string) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((error, connection) => {
                if(error){
                    reject(error);
                    console.log(error);
                }else{
                    connection.query(query, (error: MysqlError, response: any) => {
                        if(error){
                            reject(error);
                        }else{
                            resolve(response);
                        }

                        connection.release();
                    })
                }
            })
        })
    }

    insert(query: string) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((error, connection) => {
                if(error){
                    reject(error);
                    console.log(error);
                }else{
                    connection.query(query, (error: MysqlError, response: any) => {
                        if(error){
                            reject(error);
                        }else{
                            resolve(true);
                        }

                        connection.release();
                    })
                }
            })
        })
    }

    checkConnection() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((error, connection) => {
                if(error){
                    reject(error);
                }else{
                    console.log("DB Working")
                    resolve(true);
                }
            })
        })
    }
}

export = MySqlConnection;