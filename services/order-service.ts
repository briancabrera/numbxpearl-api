import MySqlConnection from "../core/mysqlConnection"
import { User } from "../models/user"
import { ProductService } from "./product-service"
import { UserService } from "./user-service"

export class OrderService {

    constructor (
        private userService: UserService,
        private productService: ProductService
    ) {}

    public getOrders(req, res) {
        return 1
    }

    public getOrder(req, res) {
        return 1
    }

    public createOrder(req, res) {
        return 1
    }

    public updateOrder(req, res) {
        return 1
    }

    public deleteOrder(req, res) {
        return 1
    }
}