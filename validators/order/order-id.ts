import Joi from "joi";

export const orderIdValidator = Joi.object({
    order_id: Joi.number()
        .integer()
        .required()
})