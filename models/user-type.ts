import MySqlConnection from "../core/mysqlConnection";
import { Roles } from "./roles";

export class UserType {

    constructor (
        public user_type: string,
        public user_type_id: number
    ) {}
}