import MySqlConnection from "../core/mysqlConnection";
import { Product } from "./product";

export class ProductVariant {
     
    constructor (
        public variant_id: number,
        public color: string,
        public size: string,
        private created_at: string,
        private updated_at: string,
        private deleted_at: string
    ) {}
}