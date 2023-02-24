import Joi from "joi";


export const getCategorySchema = Joi.object({
    category_id: Joi.number()
        .integer()
        .required()
})


