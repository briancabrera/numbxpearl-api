import Joi from "joi";

export const newUserSchema = Joi.object({
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
    document: Joi.string()
        .max(8)
        .alphanum()
        .required()
})