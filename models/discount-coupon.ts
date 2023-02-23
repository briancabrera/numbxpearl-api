import MySqlConnection from "../core/mysqlConnection";

export class DiscountCoupon {

    constructor (
        public coupon_id: number,
        public coupon_code: string,
        public percentage: number,
        public valid_until: string,
        public is_active: boolean = false,
        public uses: number,
        private created_at: string,
        private updated_at: string,
        private deleted_at: string
    ) {}
}