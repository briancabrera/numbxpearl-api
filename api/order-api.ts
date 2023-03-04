import express from 'express';
import { makeResponse } from '../helpers/responseHelper';
import { OrderService } from '../services/order-service';
import { newOrderSchema } from '../validators/order/new-order';

const orderApi = express.Router();
const service = new OrderService();

orderApi.get('/', (req, res) => service.getOrders(req, res))

// orderApi.get('/:id', (req, res) => service.getOrder(req, res))

orderApi.post("/", async (req, res) => {   
    try {
        const {error, value} = await newOrderSchema.validateAsync(req.body)
    
        if (!error) {
            let { 
                company_id,
                coupon_id,
                products,
                payer } = req.body
            const data = await service.createOrder(products, payer, company_id, coupon_id)
            if (data) {
                return makeResponse(res, 201, data, true, null)
            } else {
                return makeResponse(res, 400, null, false, ['Bad request'])
            }
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

orderApi.post("/mercadopago", async (req, res) => {
    let status = 200;

    switch(req.body.action) {
        case 'payment.created':
            let success = await service.updateOrderStatus(Number(req.body.data.id))
            if (!success) {
                status = 400
            }
    }

    res.status(status).send()
})

orderApi.delete("/:id", (req, res) => service.deleteOrder(req, res))

export = orderApi