import Joi from "joi";

export const deleteUserSchema = Joi.object({
    user_id: Joi.number()
        .integer()
        .required()
})