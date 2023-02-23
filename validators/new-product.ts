import Joi from "joi";

export const newProductSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(5)
        .max(64)
        .required(),
    price: Joi.number()
        .integer()
        .required(),
    description: Joi.string()
        .max(128),
    available: Joi.boolean(),
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