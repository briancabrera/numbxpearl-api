import MySqlConnection from "../core/mysqlConnection";
import { Address } from "./address";
import { UserType } from "./user-type"

export class User {

    constructor (
        public user_id: number,
        public firstname: string,
        public lastname: string,
        public email: string,
        public phone: string,
        private user_type: UserType,
        private password: string,
        private document: string,
        private created_at: string,
        private updated_at: string,
        private deleted_at: string,
    ) {}

    

}