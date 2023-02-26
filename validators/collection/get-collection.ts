import Joi from "joi";

export const getCollectionSchema = Joi.object({
    collection_id: Joi.number()
        .integer()
        .required()
})