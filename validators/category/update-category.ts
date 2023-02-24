import Joi from "joi";


export const updateCategorySchema = Joi.object({
    category_id: Joi.number()
        .integer()
        .required(),
    category_name: Joi.string()
        .max(32)
        .required()
})


