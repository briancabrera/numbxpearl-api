import Joi from "joi";

export const newAddressSchema = Joi.object({
    country: Joi.string()
        .max(2)
        .required(),
    department: Joi.string()
        .max(2)
        .required(),
    address: Joi.string()
        .max(255)
        .required(),
    user_id: Joi.number()
        .integer()
        .required()
})