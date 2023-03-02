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
                let address = await this.userService.getUserAddressId(payer.user_id, 1, payer.address.department_id, payer.address.address)
                payer.address.address_id = address['address_id']
            }

            let preferenceProducts = []
            for (let i = 0; i < products.length; i++) {
                let product = await this.productService.getVariantWithProduct(products[i].product_id, products[i].color, products[i].size)
                preferenceProducts.push(product)
            }

            const preference = await this.mpService.createPreference(preferenceProducts, payer, company_id, coupon_id)

            if (preference) {
                return preference    
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