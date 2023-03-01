import MySqlConnection from "../core/mysqlConnection"
import { User } from "../models/user"

export class CouponService {

    constructor (
        // private company_id: number,
        // private user: User
    ) {}

    public async getCompanyDiscountCoupons(
        company_id: number
    ) {
        return new Promise((resolve, reject) => {
            let sqlText = `
                SELECT discount_coupon.coupon_id, discount_coupon.coupon_code, discount_coupon.percentage,
                discount_coupon.is_active, discount_coupon.uses, discount_coupon.company_id
                FROM discount_coupon
                WHERE discount_coupon.company_id = ${company_id} AND
                discount_coupon.deleted_at IS NULL;
            `;

            MySqlConnection
                .getInstance()
                .fetch(sqlText)
                .then((data) => {
                    let res = JSON.parse(JSON.stringify(data))
                    res && res.length ? resolve(res) : resolve(null);
                })
                .catch((error) => {
                    console.log(error)
                    reject(error);
                })
        })
    }

    public async getDiscountCouponByCode(
        coupon_code: string
    ) {
        return new Promise((resolve, reject) => {
            let sqlText = `
                SELECT discount_coupon.coupon_id, discount_coupon.coupon_code, discount_coupon.percentage,
                discount_coupon.is_active, discount_coupon.uses, discount_coupon.company_id
                FROM discount_coupon
                WHERE discount_coupon.coupon_code = "${coupon_code}" AND
                discount_coupon.deleted_at IS NULL;
            `;

            MySqlConnection
                .getInstance()
                .fetch(sqlText)
                .then((data) => {
                    let res = JSON.parse(JSON.stringify(data))
                    res && res.length ? resolve(res[0]) : resolve(null);
                })
                .catch((error) => {
                    console.log(error)
                    reject(null);
                })
        })
    }

    public async getDiscountCouponById(
        coupon_id: number
    ) {
        return new Promise((resolve, reject) => {
            let sqlText = `
                SELECT discount_coupon.coupon_id, discount_coupon.coupon_code, discount_coupon.percentage,
                discount_coupon.is_active, discount_coupon.uses, discount_coupon.company_id
                FROM discount_coupon
                WHERE discount_coupon.coupon_id = ${coupon_id} AND
                discount_coupon.deleted_at IS NULL;
            `;

            MySqlConnection
                .getInstance()
                .fetch(sqlText)
                .then((data) => {
                    let res = JSON.parse(JSON.stringify(data))
                    res && res.length ? resolve(res[0]) : resolve(null);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    public async createDiscountCoupon(
        company_id: number = 0,
        coupon_code: string,
        percentage: number,
        is_active: number) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                INSERT INTO discount_coupon(coupon_code, percentage, is_active, company_id, uses)
                VALUES ("${coupon_code}", ${percentage}, ${is_active}, ${company_id}, 0);
            `;

            MySqlConnection
                .getInstance()
                .runQuery(sqlText)
                .then((success) => {
                    if (success) {
                        resolve(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                })
        })
    }

    public async updateDiscountProduct(
        coupon_id: number,
        coupon_code: string,
        percentage: number,
        is_active: number) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                UPDATE discount_coupon
                SET discount_coupon.coupon_code = "${coupon_code}",
                discount_coupon.percentage = ${percentage},
                discount_coupon.is_active = ${is_active},
                discount_coupon.updated_at = NOW()
                WHERE discount_coupon.coupon_id = ${coupon_id} AND
                discount_coupon.deleted_at IS NULL;
            `;

            MySqlConnection
                .getInstance()
                .runQuery(sqlText)
                .then((success) => {
                    if (success) {
                        resolve(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                })
        })
    }

    public async deleteDiscountCoupon(
        coupon_id: number) {
        return new Promise ((resolve, reject) => {
            let sqlText = `
                UPDATE discount_coupon
                SET discount_coupon.deleted_at = NOW()
                WHERE discount_coupon.coupon_id = ${coupon_id} AND
                discount_coupon.deleted_at IS NULL
            `;

            MySqlConnection
                .getInstance()
                .runQuery(sqlText)
                .then((success) => {
                    if (success) {
                        resolve(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                })
        })
    }
}