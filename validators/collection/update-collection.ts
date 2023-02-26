import Joi from "joi"

export const updateCollectionSchema = Joi.object({
    collection_name: Joi.string()
        .max(32)
        .required(),
    available: Joi.number()
        .integer()
        .required(),
    collection_id: Joi.number()
        .integer()
        .required()
})