import Joi from "joi";

export const companyIdValidator = Joi.object({
    company_id: Joi.number()
        .integer()
        .required()
})