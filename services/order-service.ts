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

    public getOrder(req, res) {
        return 1
    }

    public async createOrder(
        products,
        payer,
        company_id: number,
        coupon_id: number = null
    ) {
        try {
            let user = await this.userService.getUserByDocument(payer['document'])
            console.log("user:", user)
            if (!user) {
                let success = await this.userService.createUser(
                    payer.name.trim(),
                    payer.lastname.trim(),
                    payer.email.trim(),
                    payer.phone.trim(),
                    payer.document.trim())
                if (success) {
                    user = await this.userService.getUserByDocument(payer['document'])
                    payer.user_id = user['user_id']
                    await this.userService.createUserAddress(1, payer.address.department_id, payer.address.address, payer.user_id)
                }
        } else {
            products = products.forEach(async (product) => {
                product = await this.productService.getVariantWithProduct(product.product_id, product.color, product.size)
                return product
            })

            const preference = await this.mpService.createPreference(products, payer, company_id, coupon_id)

            if (preference) {
                return preference
                // return new Promise((resolve, reject) => {
                //     const sqlText = `
                //         INSERT INTO purchase_order(status, mp_reference, user_id, company_id, coupon_id)
                //         VALUES ("pending", "${preferenceData.external_reference}", ${payer.user_id}, 2, NULL)
                //     `;
    
                //     MySqlConnection
                //         .getInstance()
                //         .runQuery(sqlText)
                //         .then((success) => {
                //             if (success) {
                //                 resolve(preference);
                //             }
                //         })
                //         .catch((error) => {
                //             console.log(error);
                //             reject(error);
                //     })
                // })
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