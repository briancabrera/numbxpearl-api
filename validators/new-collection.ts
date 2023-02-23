import Joi from "joi";

export const newCollectionSchema = Joi.object({
    collection_name: Joi.string()
        .alphanum()
        .max(32)
        .required(),
    available: Joi.boolean(),
    company_id: Joi.number()
        .integer()
        .required()
})