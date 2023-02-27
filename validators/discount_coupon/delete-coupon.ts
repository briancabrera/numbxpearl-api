import Joi from "joi";

export const deleteDiscountCouponSchema = Joi.object({
    coupon_id: Joi.number()
        .integer()
        .required()
})