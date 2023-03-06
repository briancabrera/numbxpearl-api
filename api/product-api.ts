import express from 'express';
import asyncMiddleware from 'middleware-async';
import { makeResponse } from '../helpers/responseHelper';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { superadminMiddleware } from '../middlewares/superadminMiddleware';
import { ProductService } from '../services/product-service';
import { deleteProductSchema, getProductSchema, newProductSchema, updateProductSchema, newProductVariantsSchema } from '../validators/product';

const productApi = express.Router();
const service = new ProductService();


productApi.get('/:product_id', async (req, res) => {   
    try {
        const {error, value} = await getProductSchema.validateAsync(req.params)

        if (!error) {
            const { product_id } = req.params
            const product = await service.getProduct(product_id)
            if (product) {
                return makeResponse(res, 200, product, true, null)
            } else {
                return makeResponse(res, 404, null, false, ['Product not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, err, false, ['Internal server error'])
    }
})

productApi.post("/", superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await newProductSchema.validateAsync(req.body)
    
        if (!error) {
            let { 
                name,
                price, 
                description,
                available,
                company_id,
                collection_id,
                category_id } = req.body
            const success = await service.createProduct(name.trim(), price, description.trim(), available, company_id, collection_id, category_id)
            if (success) {
                return makeResponse(res, 201, null, true, null)
            } else {
                return makeResponse(res, 400, null, false, ['Bad request'])
            }
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

productApi.post("/:product_id/variants", superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await newProductVariantsSchema.validateAsync({...req.body, ...req.params})
    
        if (!error) {
            let { 
                colors,
                sizes } = req.body
            let { product_id } = req.params
            const product = await service.getProduct(product_id)
            if (product) {
                const success = await service.createProductVariants(product_id, colors, sizes)
                if (success) {
                    return makeResponse(res, 201, null, true, null)
                } else {
                    return makeResponse(res, 400, null, false, ['Bad request'])
                }
            } else {
                makeResponse(res, 404, null, false, ['Product not found with id ' + product_id])
            }
            
        }
    } catch (err) {
        console.log(err)
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

productApi.put("/:product_id", superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await updateProductSchema.validateAsync({...req.body, ...req.params})
        if (!error) {
            let { 
                name,
                price, 
                description,
                available,
                company_id,
                collection_id,
                category_id } = req.body
            let { product_id } = req.params
            const product = await service.getProduct(product_id);
            if (product) {
                const success = await service.updateProduct(product_id, name.trim(), price, description.trim(), available, company_id, collection_id, category_id)
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

productApi.delete("/:product_id", superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await deleteProductSchema.validateAsync(req.params)
    
        if (!error) {
            let { product_id } = req.params
            const product = await service.getProduct(product_id)
            if (product) {
                const success = await service.deleteProduct(product_id)
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

export = productApi