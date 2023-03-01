import mercadopago from "mercadopago";
import { MercadoPago } from "mercadopago/interface";
import { mercadoPagoConfig } from "../config/mpConfig";

export class mpService {
    private mp: MercadoPago

    constructor() {
        this.mp.configure(mercadoPagoConfig)
    }

    public createPreference(
        products: [],
        payer: {}
    ) {}
}