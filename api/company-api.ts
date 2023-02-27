import express from 'express';
import { makeResponse } from '../helpers/responseHelper';
import { superadminMiddleware } from '../middlewares/superadminMiddleware';
import { CollectionService } from '../services/collection-service';
import { CompanyService } from '../services/company-service';
import { CouponService } from '../services/coupon-service';
import { ProductService } from '../services/product-service';
import { getCompanyCollectionsSchema } from '../validators/collection';
import { getCompanyDiscountCouponsSchema } from '../validators/discount_coupon/get-company-coupons';
import { getCompanyProductsSchema } from '../validators/product';

const companyApi = express.Router();

companyApi.get('/', (req, res) => res.status(503).send())

companyApi.get('/:id', (req, res) => res.status(503).send())

companyApi.post("/", superadminMiddleware, (req, res) => res.status(503).send())

companyApi.put("/:id", superadminMiddleware, (req, res) => res.status(503).send())

companyApi.delete("/:id", superadminMiddleware, (req, res) => res.status(503).send())

companyApi.get('/:company_id/products', superadminMiddleware, async (req, res) => {
    try {
        const {error, value} = await getCompanyProductsSchema.validateAsync(req.params)
        const service = new ProductService();
        
        if (!error) {
            const { company_id } = req.params
            const products = await service.getCompanyProducts(company_id)
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
        const {error, value} = await getCompanyCollectionsSchema.validateAsync(req.params)
        const service = new CollectionService();
        
        if (!error) {
            const { company_id } = req.params
            const collections = await service.getCompanyCollections(company_id)
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

companyApi.get('/:company_id/coupons', superadminMiddleware, async (req, res) => {
    try {
        const {error, value} = await getCompanyDiscountCouponsSchema.validateAsync(req.params)
        const service = new CouponService();
        
        if (!error) {
            const { company_id } = req.params
            const coupons = await service.getCompanyDiscountCoupons(company_id)
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

export = companyApi