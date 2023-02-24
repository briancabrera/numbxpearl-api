import Joi from "joi";

export const createAddressSchema = Joi.object({
    country_id: Joi.number()
        .integer()
        .required(),
    department_id: Joi.number()
        .integer()
        .required(),
    address: Joi.string()
        .max(255)
        .required(),
    user_id: Joi.number()
        .integer()
        .required()
})