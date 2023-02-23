import MySqlConnection from "../core/mysqlConnection";
import { Category } from "./category";

export class Collection {

    constructor (
        public collection_id: number,
        public collection_name: string,
        public available: boolean = false,
        public company_id: string,
        private created_at: string,
        private updated_at: string,
        private deleted_at: string
    ) {}
}