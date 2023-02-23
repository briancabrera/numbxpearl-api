import MySqlConnection from "../core/mysqlConnection"
import express from 'express'
import { User } from "../models/user"

export class ProductService {

    constructor (
        // private company_id: number,
        // private user: User
    ) {}

    public getProducts(req: express.Request, res: express.Response) {
        res.status(200).send("get products")
    }

    public getProduct(req, res) {
        return 1
    }

    public createProduct(req, res) {
        return 1
    }

    public updateProduct(req, res) {
        return 1
    }

    public deleteProduct(req, res) {
        return 1
    }
}