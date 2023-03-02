import Joi from "joi";

export const newProductVariantsSchema = Joi.object({
    product_id: Joi.number()
        .integer()
        .required(),
    colors: Joi.array()
        .items(Joi.string()),
    sizes: Joi.array()
        .items(Joi.string().max(3))
})