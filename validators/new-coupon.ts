import Joi from "joi"

export const newCouponSchema = Joi.object({
    coupon_code: Joi.string()
        .alphanum()
        .max(20)
        .required(),
    percentage: Joi.number()
        .integer()
        .required(),
    valid_until: Joi.string()
        .alphanum()
        .max(10)
        .min(10),
    is_active: Joi.boolean(),
    uses: Joi.number()
        .integer()
        .required()
})