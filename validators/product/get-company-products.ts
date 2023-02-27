import Joi from "joi";

export const getCompanyProductsSchema = Joi.object({
    company_id: Joi.number()
        .integer()
        .required()
})