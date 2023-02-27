import Joi from "joi";

export const updateDiscountCouponSchema = Joi.object({
    coupon_id: Joi.number()
        .integer(),
    coupon_code: Joi.string()
        .min(5)
        .max(20)
        .required(),
    percentage: Joi.number()
        .integer()
        .required(),
    valid_until: Joi.string()
        .min(10)
        .max(10),
    is_active: Joi.number()
        .integer()
        .required()
})