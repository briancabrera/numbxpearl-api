import MySqlConnection from "../core/mysqlConnection";
import { User } from "./user";

export class Company {
    
    constructor(
        private company_name: string,
        private company_id: number
    ) {}

}