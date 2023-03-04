import mercadopago from "mercadopago";
import { v4 as uuidv4 } from 'uuid';

import { MercadoPago } from "mercadopago/interface";
import { mercadoPagoConfig } from "../config/mpConfig"; 
import MySqlConnection from "../core/mysqlConnection";

export class MpService {
    private mp = mercadopago

    constructor() {
        this.mp.configure(mercadoPagoConfig)
    }

    public async createPreference(
        products,
        payer,
        company_id: number,
        coupon_id: number = null
    ) {
        try {
            const items = products.map(product => {
                let item = {
                    id: product.variant_id,
                    title: product.name,
                    currency_id: 'UYU',
                    description: product.description,
                    category_id: "fashion",
                    quantity: 1,
                    unit_price: product.price
                }
                return item
            })
    
            const orderPayer = {
                name: payer.firstname,
                surname: payer.lastname,
                email: payer.email,
                identification: {
                    type: 'CI',
                    number: payer.document
                }
            }
    
            const preferenceData = {
                items: items,
                payer: orderPayer,
                back_urls: {
                    success: "http://www.google.com/",
                    failure: "http://www.mercadolibre.com.uy/",
                    pending: ""         
                },
                external_reference: uuidv4(),
                statement_descriptor: "NUMBxPEARL PURCHASE",
                binary_mode: true,
                payment_methods: {
                    excluded_payment_types: [
                        {
                            id: "ticket"
                        }
                    ]
                },
                metadata: {
                    company_id: company_id,
                    coupon_id: coupon_id
                },
                notification_url: "https://f1fa-2800-a4-22c0-d600-984c-e057-d3f9-c27c.sa.ngrok.io/order/mercadopago"
            }
    
            const preference = await this.mp.preferences.create(preferenceData)
    
            if (preference) {
                return preference
            }
        } catch (err) {
            console.log(err)
            return null
        }
    }

    public async findPayment(
        payment_id: number
    ) {
        const paymentData = await this.mp.payment.findById(payment_id)

        if (paymentData) {
            return paymentData.body
        } else {
            return false
        }
    }
}