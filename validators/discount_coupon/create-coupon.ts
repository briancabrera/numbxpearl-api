import Joi from "joi";

export const createDiscountCouponSchema = Joi.object({
    company_id: Joi.number()
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