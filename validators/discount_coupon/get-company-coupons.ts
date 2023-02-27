import Joi from "joi";

export const getCompanyDiscountCouponsSchema = Joi.object({
    company_id: Joi.number()
        .integer()
        .required()
})