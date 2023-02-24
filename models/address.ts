import MySqlConnection from "../core/mysqlConnection";

export class Address {

    constructor(
        public address_id: number,
        public country: string,
        public department: string,
        public address: string,
        private created_at: string,
        private updated_at: string,
        private deleted_at: string
    ) {}
    
}