import Joi from "joi";

export const updateAddressSchema = Joi.object({
    address_id: Joi.number()
        .integer()
        .required(),
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