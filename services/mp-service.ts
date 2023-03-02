import mercadopago from "mercadopago";
import uuid from 'uuid';

import { MercadoPago } from "mercadopago/interface";
import { mercadoPagoConfig } from "../config/mpConfig"; 
import MySqlConnection from "../core/mysqlConnection";

export class MpService {
    private mp: MercadoPago = mercadopago

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
            const items = products.forEach(product => {
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
                phone: {
                    area_code: '+598',
                    number: payer.phone
                },
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
                external_reference: uuid.v4(),
                statement_descriptor: "NUMBxPEARL PURCHASE",
                binary_mode: true,
                metadata: {
                    company_id: company_id,
                    coupon_id: coupon_id
                }
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
}