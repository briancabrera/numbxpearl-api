import Joi from "joi";

export const updateShipmentStatusSchema = Joi.object({
    order_id: Joi.number()
        .integer()
        .required(),
    status: Joi.string()
        .valid('sent', 'pending')
        .required()
})