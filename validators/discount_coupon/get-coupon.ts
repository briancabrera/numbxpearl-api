import Joi from "joi";

export const getDiscountCouponByCodeSchema = Joi.object({
    coupon_code: Joi.string()
        .max(20)
        .min(5)
        .required(),
})