import Joi from "joi";

export const getCollectionProductsSchema = Joi.object({
    collection_id: Joi.number()
        .integer()
        .required()
})