import MySqlConnection from "./mysqlConnection";

export async function checkMysqlConnection(){
    return new Promise((resolve, reject) => {
        try {
            const db = MySqlConnection.getInstance();
            db.checkConnection();
        } catch(error) {
            console.log("DB not working")
            reject(error);
        }
    })
}
