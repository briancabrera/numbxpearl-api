import Joi from "joi";

export const getCompanyCollectionsSchema = Joi.object({
    company_id: Joi.number()
        .integer()
        .required()
})