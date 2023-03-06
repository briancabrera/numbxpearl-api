import Joi from "joi";

export const getOrdersSchema = Joi.object({
    company_id: Joi.number()
        .integer()
        .required(),
    status: Joi.string()
        .valid('approved', 'rejected', 'cancelled', 'pending')
})