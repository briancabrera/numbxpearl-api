import Joi from "joi";

export const updateUserSchema = Joi.object({
    firstname: Joi.string()
        .max(12)
        .required(),
    lastname: Joi.string()
        .max(32)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    phone: Joi.string()
        .alphanum()
        .required(),
    password: Joi.string()
        .alphanum()
        .max(32)
        .min(8),
    document: Joi.string()
        .max(8)
        .alphanum()
        .required()
})