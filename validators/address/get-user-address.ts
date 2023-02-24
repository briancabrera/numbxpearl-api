import Joi from "joi";

export const getAddressesSchema = Joi.object({
    user_id: Joi.number()
        .integer()
        .required()
})