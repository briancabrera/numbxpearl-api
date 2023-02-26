import Joi from "joi";

export const newCollectionSchema = Joi.object({
    collection_name: Joi.string()
        .max(32)
        .required(),
    available: Joi.number()
        .integer()
        .required(),
    company_id: Joi.number()
        .integer()
        .required()
})