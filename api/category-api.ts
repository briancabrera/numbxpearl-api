import express from 'express';
import { makeResponse } from '../helpers/responseHelper';
import { superadminMiddleware } from '../middlewares/superadminMiddleware';
import { CategoryService } from '../services/category-service';
import { getCategorySchema, newCategorySchema, updateCategorySchema } from '../validators/category';

const categoryApi = express.Router();
const service = new CategoryService();

categoryApi.get('/', superadminMiddleware, async (req, res) => {
    try {
        const categories = await service.getCategories();
        if (categories) {
            return makeResponse(res, 200, categories, true, null)
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, err, false, ['Internal server error'])
    }
})

categoryApi.get('/:category_id', superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await getCategorySchema.validateAsync(req.params)

        if (!error) {
            const { category_id } = req.params
            const category = await service.getCategoryById(category_id)
            if (category) {
                return makeResponse(res, 200, category, true, null)
            } else {
                return makeResponse(res, 404, null, false, ['Category not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, err, false, ['Internal server error'])
    }
})

categoryApi.post("/", superadminMiddleware, async (req, res) => {   
    try {
        console.log(req.body)
        const {error, value} = await newCategorySchema.validateAsync(req.body)
    
        if (!error) {
            let { category_name } = req.body
            category_name = category_name.toLowerCase().trim()
            const categoryExists = await service.getCategoryByName(category_name)
            if (!categoryExists) {
                const success = await service.createCategory(category_name)
                if (success) {
                    return makeResponse(res, 201, null, true, null)
                } else {
                    return makeResponse(res, 400, null, false, ['Bad request'])
                }
            } else {
                return makeResponse(res, 409, null, false, ['Category already exists'])
            }
        }
    } catch (err) {
        console.log(err)
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

categoryApi.put("/:category_id", superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await updateCategorySchema.validateAsync({ ...req.params, ...req.body})
    
        if (!error) {
                const { category_id } = req.params 
                let { category_name } = req.body 
                const success = await service.updateCategory(category_id, category_name.trim())
                if (success) {
                    return makeResponse(res, 201, null, true, null)
                } else {
                    return makeResponse(res, 400, null, false, ['Bad request'])
                }
            } else {
                return makeResponse(res, 409, null, false, ['Category already exists'])
            }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

categoryApi.delete("/:category_id", superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await getCategorySchema.validateAsync(req.params)
    
        if (!error) {
                const { category_id } = req.params 
                const success = await service.deleteCategory(category_id)
                if (success) {
                    return makeResponse(res, 201, null, true, null)
                } else {
                    return makeResponse(res, 400, null, false, ['Bad request'])
                }
            } else {
                return makeResponse(res, 409, null, false, ['Category already exists'])
            }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

export = categoryApi