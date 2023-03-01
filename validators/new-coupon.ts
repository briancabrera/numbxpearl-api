import Joi from "joi"

export const newCouponSchema = Joi.object({
    company_id: Joi.number()
        .integer()
        .required(),
    coupon_code: Joi.string()
        .alphanum()
        .max(20)
        .required(),
    percentage: Joi.number()
        .integer()
        .required(),
    is_active: Joi.number()
        .integer()
        .required()
})