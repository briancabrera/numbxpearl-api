import MySqlConnection from "../core/mysqlConnection"
import { User } from "../models/user"
import { MpService } from "./mp-service"
import { ProductService } from "./product-service"
import { UserService } from "./user-service"

export class OrderService {
    private userService: UserService
    private productService: ProductService
    private mpService: MpService

    constructor () {
        this.userService = new UserService();
        this.productService = new ProductService();
        this.mpService = new MpService();
    }

    public getOrders(req, res) {
        return 1
    }

    private async getOrderByMpReference(
        mp_reference: string
    ) {
        return new Promise((resolve, reject) => {
            let sqlText = `
                SELECT purchase_order.order_id
                FROM purchase_order
                WHERE purchase_order.mp_reference = "${mp_reference}" AND
                purchase_order.deleted_at IS NULL;
            `

            MySqlConnection.getInstance()
                .fetch(sqlText)
                .then(data => {
                    let res = JSON.parse(JSON.stringify(data))
                    res && res.length ? resolve(res[0]) : reject(null)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        
        })
    }

    public async createOrder(
        products,
        payer,
        company_id: number,
        coupon_id: number = null
    ) {
        try {
            
            if (!payer.user_id) {
                let success = await this.userService.createUser(
                    payer.name.trim(),
                    payer.lastname.trim(),
                    payer.email.trim(),
                    payer.phone.trim(),
                    payer.document.trim())
                if (success) {
                    let user = await this.userService.getUserByDocument(payer['document'])
                    payer.user_id = user['user_id']
                }
            }

            if (!payer.address.address_id) {
                await this.userService.createUserAddress(1, payer.address.department_id, payer.address.address, payer.user_id)
                let address = await this.userService.getUserAddressId(1, payer.address.department_id, payer.address.address, payer.user_id)
                payer.address.address_id = address['address_id']
            }

            let amount = 0;
            let preferenceProducts = []
            for (let i = 0; i < products.length; i++) {
                let product = await this.productService.getVariantWithProduct(products[i].product_id, products[i].color, products[i].size)
                amount += product['price']
                preferenceProducts.push(product)
            }

            const preference = await this.mpService.createPreference(preferenceProducts, payer, company_id, coupon_id)

            if (preference) {
                let sqlText = `
                    INSERT INTO purchase_order(status, mp_reference, amount, user_id, company_id, coupon_id)
                    VALUES ("PENDING", "${preference.body.external_reference}", ${amount}, ${payer.user_id}, ${company_id}, ${coupon_id})
                `
                let orderCreated = await MySqlConnection
                    .getInstance()
                    .runQuery(sqlText)

                if (orderCreated) {
                    let order = await this.getOrderByMpReference(preference.body.external_reference)
                    for (let i = 0; i < preferenceProducts.length; i++) {
                        let sqlText = `
                            INSERT INTO order_products(order_id, variant_id)
                            VALUES (${order['order_id']}, ${preferenceProducts[i].variant_id})
                        `
                        let productRegistered = await MySqlConnection
                            .getInstance()
                            .runQuery(sqlText)
                        
                        if (!productRegistered) {
                            return false
                        }
                    }

                    return preference.body.sandbox_init_point
                }
            }
        } catch (err) {
            console.log(err)
            return null
        }
    }

    public updateOrder(req, res) {
        return 1
    }

    public deleteOrder(req, res) {
        return 1
    }
}