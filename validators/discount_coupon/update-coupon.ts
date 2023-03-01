import Joi from "joi";

export const updateDiscountCouponSchema = Joi.object({
    coupon_id: Joi.number()
        .integer()
        .required(),
    coupon_code: Joi.string()
        .min(5)
        .max(20)
        .required(),
    percentage: Joi.number()
        .integer()
        .required(),
    is_active: Joi.number()
        .integer()
        .required()
})