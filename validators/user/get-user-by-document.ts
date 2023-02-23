import Joi from "joi";

export const getUserByDocumentSchema = Joi.object({
    document: Joi.string()
        .max(8)
        .alphanum()
        .required()
})