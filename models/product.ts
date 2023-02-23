import MySqlConnection from "../core/mysqlConnection";
import { ProductVariant } from "./product-variant";

export class Product {

    constructor (
        public product_id: number,
        public name: string,
        public price: number,
        public description: string = "",
        public available: boolean = false,
        public variants: ProductVariant[] = [],
        private company_id: number,
        private collection_id: number,
        private category_id: number,
        private created_at: string,
        private updated_at: string,
        private deleted_at: string
    ) {}
}