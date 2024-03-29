import Joi from "joi";

export const newOrderSchema = Joi.object({
    company_id: Joi.number()
        .integer()
        .required(),
    coupon_id: Joi.number()
        .integer(),
    products: Joi.array()
        .items(Joi.object({
            product_id: Joi.number()
                .integer()
                .required(),
            color: Joi.string()
                .required(),
            size: Joi.string()
                .max(3)
                .required()
        })),
    payer: Joi.object({
        user_id: Joi.number()
            .integer(),
        name: Joi.string()
            .max(12)
            .required(),
        lastname: Joi.string()
            .max(32)
            .required(),
        email: Joi.string()
            .max(128)
            .required(),
        phone: Joi.string()
            .max(9)
            .required(),
        document: Joi.string()
            .min(8)
            .max(8)
            .required(),
        address: {
            address_id: Joi.number()
                .integer(),
            country_id: Joi.number()
                .integer()
                .required(),
            department_id: Joi.number()
                .integer()
                .required(),
            address: Joi.string()
                .max(255)
                .required(),
        }
    }).required()
})