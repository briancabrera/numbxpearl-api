import Joi from "joi";

export const newProductVariantSchema = Joi.object({
    color: Joi.string()
        .max(15)
        .required(),
    size: Joi.string()
        .max(3)
        .required()
})