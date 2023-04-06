import express from 'express';
import { makeResponse } from '../helpers/responseHelper';
import { verifyToken } from '../middlewares/verifyToken';
verifyToken
import { CollectionService } from '../services/collection-service';
import { CompanyService } from '../services/company-service';
import { CouponService } from '../services/coupon-service';
import { OrderService } from '../services/order-service';
import { ProductService } from '../services/product-service';
import { companyIdValidator } from '../validators/company.ts/company-id';
import { getOrdersSchema } from '../validators/order';

const companyApi = express.Router();

companyApi.get('/', (req, res) => res.status(503).send())

companyApi.get('/:id', (req, res) => res.status(503).send())

companyApi.post("/", verifyToken, (req, res) => res.status(503).send())

companyApi.put("/:id", verifyToken, (req, res) => res.status(503).send())

companyApi.delete("/:id", verifyToken, (req, res) => res.status(503).send())

companyApi.get('/:company_id/products', verifyToken, async (req, res) => {
    try {
        const {error, value} = await companyIdValidator.validateAsync(req.params)
        const service = new ProductService();
        
        if (!error) {
            const { company_id } = req.params
            const products = await service.getCompanyProducts(Number(company_id))
            if (products) {
                return makeResponse(res, 200, products, true, null)
            } else {
                return makeResponse(res, 404, null, false, ['No products found for the company'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch(err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

companyApi.get('/:company_id/collections', async (req, res) => {
    try {
        const {error, value} = await companyIdValidator.validateAsync(req.params)
        const service = new CollectionService();
        
        if (!error) {
            const { company_id } = req.params
            const collections = await service.getCompanyCollections(Number(company_id))
            if (collections) {
                return makeResponse(res, 200, collections, true, null)
            } else {
                return makeResponse(res, 404, null, false, ['No collections found for the company'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch(err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

companyApi.get('/:company_id/coupons', verifyToken, async (req, res) => {
    try {
        const {error, value} = await companyIdValidator.validateAsync(req.params)
        const service = new CouponService();
        
        if (!error) {
            const { company_id } = req.params
            const coupons = await service.getCompanyDiscountCoupons(Number(company_id))
            if (coupons) {
                return makeResponse(res, 200, coupons, true, null)
            } else {
                return makeResponse(res, 404, null, false, ['No coupons found for the company'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch(err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

companyApi.get('/:company_id/orders', verifyToken, async (req, res) => {   
    try {
        let {error, value} = await getOrdersSchema.validateAsync({...req.params, ...req.query})
        const service = new OrderService();

        if (!error) {
            const { company_id } = req.params
            const { status } = req.query
            const orders = await service.getOrders(Number(company_id), String(status))
            if (orders) {
                return makeResponse(res, 200, orders, true, null)
            } else {
                return makeResponse(res, 404, null, false, ['No orders were found for the selected company'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, err, false, ['Internal server error'])
    }
})

export = companyApi