import Joi from "joi";

export const getUserAddressSchema = Joi.object({
    address_id: Joi.number()
        .integer()
        .required(),
    user_id: Joi.number()
        .integer()
        .required()
})