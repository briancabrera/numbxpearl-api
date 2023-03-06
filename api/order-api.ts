import express from 'express';
import { makeResponse } from '../helpers/responseHelper';
import { superadminMiddleware } from '../middlewares/superadminMiddleware';
import { OrderService } from '../services/order-service';
import { orderIdValidator, newOrderSchema, updateShipmentStatusSchema } from '../validators/order';

const orderApi = express.Router();
const service = new OrderService();

orderApi.get('/:order_id', superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await orderIdValidator.validateAsync(req.params)

        if (!error) {
            const { order_id } = req.params
            const order = await service.getOrderDetail(order_id)
            if (order) {
                return makeResponse(res, 200, order, true, null)
            } else {
                return makeResponse(res, 404, null, false, ['Order not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, err, false, ['Internal server error'])
    }
})

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

orderApi.put('/:order_id', superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await updateShipmentStatusSchema.validateAsync({...req.body, ...req.params})
        if (!error) {
            let { shipment_status } = req.body
            let { order_id } = req.params
            const order = await service.getOrder(order_id);
            if (order) {
                const success = await service.updateOrderShipmentStatus(order_id, shipment_status)
                if (success) {
                    return makeResponse(res, 200, null, true, null)
                } else {
                    return makeResponse(res, 409, null, false, ['Conflict'])
                }
            } else {
                return makeResponse(res, 404, null, false, ['User not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

orderApi.delete("/:order_id", superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await orderIdValidator.validateAsync(req.params)
    
        if (!error) {
            let { order_id } = req.params
            const order = await service.getOrder(order_id)
            if (order) {
                const success = await service.deleteOrder(order_id)
                if (success) {
                    return makeResponse(res, 200, null, true, null)
                } else {
                    return makeResponse(res, 409, null, false, ['Conflict'])
                }
            } else {
                return makeResponse(res, 404, null, false, ['User not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

export = orderApi