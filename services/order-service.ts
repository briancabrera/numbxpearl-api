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

    public async getOrders(
        company_id: number,
        status: string
    ) {
        
    }

    public async getOrderDetail(
        order_id: number
    ) {
        try {
            let sqlText = `
                SELECT purchase_order.order_id, purchase_order.status, purchase_order.amount,
                purchase_order.company_id, purchase_order.coupon_id,
                discount_coupon.coupon_code, discount_coupon.percentage,
                users.user_id, users.firstname, users.lastname, users.email, users.phone, users.document,
                address.address_id, address.address,
                country.country_name,
                department.department_name
                FROM purchase_order, users, address, country, department, order_products, product_variant, product
                WHERE purchase_order.order_id = ${order_id} AND
                discount_coupon.coupon_id = purchase_order.coupon_id AND
                users.user_id = purchase_order.order_id AND
                address.user_id = users.user_id AND
                country.country_id = address.country_id AND
                department.department_id = address.department_id AND
                purchase_order.deleted_at IS NULL AND
                discount_coupon.deleted_at IS NULL AND
                users.deleted_at IS NULL AND
                address.deleted_at IS NULL;
            `;

            const order = await MySqlConnection.getInstance()
                    .fetch(sqlText)
                    .then(data => JSON.parse(JSON.stringify(data))[0])
            
            order.products = await this.getOrderProducts(order_id)

            return order

        } catch (err) {
            console.log(err)
            return false
        }

    }

    private async getOrderProducts(
        order_id: number
    ) {
        return new Promise((resolve, reject) => {
            let sqlText = `
                SELECT order_products.variant_id,
                product_variant.size, product_variant.color,
                product.product_id, product.name, product.price
                FROM order_products, product_variant, product
                WHERE order_products.order_id = ${order_id} AND
                product_variant.variant_id = order_products.variant_id AND
                product.product_id = product_variant.product_id
                product_variant.deleted_at IS NULL AND
                product.deleted_at IS NULL
            `

            MySqlConnection.getInstance()
                .fetch(sqlText)
                .then(data => {
                    let res = JSON.parse(JSON.stringify(data))
                    res && res.length ? resolve(res) : reject(null)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })

        })
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
                    INSERT INTO purchase_order(status, mp_reference, amount, user_id, address_id, company_id, coupon_id)
                    VALUES ("created", "${preference.body.external_reference}", ${amount}, ${payer.user_id}, ${payer.address.address_id}, ${company_id}, ${coupon_id})
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

                    return preference
                }
            }
        } catch (err) {
            console.log(err)
            return null
        }
    }

    public async updateOrderStatus(
        payment_id: number
    ) {
        try {
            let paymentData = await this.mpService.findPayment(payment_id)

            if (paymentData) {
                let sqlText = `
                    UPDATE purchase_order
                    SET purchase_order.status = "${paymentData['status']}",
                    purchase_order.payment_id = "${payment_id}",
                    purchase_order.updated_at = NOW()
                    WHERE purchase_order.mp_reference = "${paymentData['external_reference']}"
                `

                let success = await MySqlConnection
                    .getInstance()
                    .runQuery(sqlText)

                if (success) {
                    return true
                } 

                return false
            }
        } catch (err) {
            console.log(err)
            return false
        }
    }

    public updateOrder(req, res) {
        return 1
    }

    public deleteOrder(req, res) {
        return 1
    }
}