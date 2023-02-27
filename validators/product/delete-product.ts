import Joi from "joi";

export const deleteProductSchema = Joi.object({
    product_id: Joi.number()
        .integer()
        .required()
})