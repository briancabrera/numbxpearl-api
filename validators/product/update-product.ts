import Joi from "joi";

export const updateProductSchema = Joi.object({
    product_id: Joi.number()
        .integer()
        .required(),
    name: Joi.string()
        .max(32)
        .required(),
    price: Joi.number()
        .integer()
        .required(),
    description: Joi.string()
        .max(128),
    available: Joi.number()
        .integer()
        .required(),
    company_id: Joi.number()
        .integer()
        .required(),
    collection_id: Joi.number()
        .integer()
        .required(),
    category_id: Joi.number()
        .integer()
        .required()
})