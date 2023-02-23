import MySqlConnection from "../core/mysqlConnection"

export class Category {

    constructor (
        public category_id: number,
        public category_name: string,
        private created_at: string,
        private updated_at: string,
        private deleted_at: string
    ) {}
}