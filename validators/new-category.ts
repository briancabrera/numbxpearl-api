import Joi from "joi";


export const newCategorySchema = Joi.object({
    category_name: Joi.string()
        .max(32)
        .required()
})