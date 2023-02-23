import MySqlConnection from "../core/mysqlConnection";
import { ProductVariant } from "./product-variant";

export class PurchaseOrder {

    constructor (
        public order_id: number,
        private status: string,
        private mp_reference: string,
        public payment_method: string,
        public products: ProductVariant[] = [],
        public user_id: number,
        public company_id: number,
        public coupon_id: number,
        public address_id: number,
        private created_at: string,
        private updated_at: string,
        private deleted_at: string
        ) {}
}