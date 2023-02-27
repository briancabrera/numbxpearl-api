import Joi from "joi";

export const getProductSchema = Joi.object({
    product_id: Joi.number()
        .integer()
        .required()
})