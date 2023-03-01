import express from 'express';
import { makeResponse } from '../helpers/responseHelper';
import { superadminMiddleware } from '../middlewares/superadminMiddleware';
import { CollectionService } from '../services/collection-service';
import { ProductService } from '../services/product-service';
import { deleteCollectionSchema, getCollectionSchema, getCompanyCollectionsSchema, newCollectionSchema, updateCollectionSchema } from '../validators/collection';
import { getCollectionProductsSchema } from '../validators/product';

const collectionApi = express.Router();
const service = new CollectionService();


collectionApi.get('/:collection_id/products', async (req, res) => {   
    try {
        const {error, value} = await getCollectionProductsSchema.validateAsync(req.params)
        const productService = new ProductService();

        if (!error) {
            const { collection_id } = req.params
            const products = await productService.getCollectionProducts(collection_id)
            if (products) {
                return makeResponse(res, 200, products, true, null)
            } else {
                return makeResponse(res, 404, null, false, ['No products found in the collection'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, err, false, ['Internal server error'])
    }
})

collectionApi.get('/:collection_id', async (req, res) => {   
    try {
        const {error, value} = await getCollectionSchema.validateAsync(req.params)

        if (!error) {
            const { collection_id } = req.params
            const collection = await service.getCollection(collection_id)
            if (collection) {
                return makeResponse(res, 200, collection, true, null)
            } else {
                return makeResponse(res, 404, null, false, ['Collection not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, err, false, ['Internal server error'])
    }
})

collectionApi.post("/", superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await newCollectionSchema.validateAsync(req.body)
    
        if (!error) {
            let { collection_name, available, company_id } = req.body
            const success = await service.createCollection(collection_name.trim(), available, company_id)
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

collectionApi.put("/:collection_id", superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await updateCollectionSchema.validateAsync({...req.body, ...req.params})
        if (!error) {
            let { collection_name, available } = req.body
            let { collection_id } = req.params
            const collection = await service.getCollection(collection_id);
            if (collection) {
                const success = await service.updateCollection(collection_id, collection_name.trim(), available)
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

collectionApi.delete("/:collection_id", superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await deleteCollectionSchema.validateAsync(req.params)
    
        if (!error) {
            let { collection_id } = req.params
            const collection = await service.getCollection(collection_id)
            if (collection) {
                const success = await service.deleteCollection(collection_id)
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

export = collectionApi