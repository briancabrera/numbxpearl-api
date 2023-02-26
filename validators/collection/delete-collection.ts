import Joi from "joi";

export const deleteCollectionSchema = Joi.object({
    collection_id: Joi.number()
        .integer()
        .required()
})