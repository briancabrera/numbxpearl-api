import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import { checkMysqlConnection } from './core/health';

import categoryApi from './api/category-api';
import collectionApi from './api/collection-api';
import companyApi from './api/company-api';
import couponApi from './api/discount-coupon-api';
import orderApi from './api/order-api';
import productApi from './api/product-api';
import userApi from './api/user-api';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT: number = 8080;

app.listen(PORT, () => {
    console.log(`Facts Events service listening at http://localhost:${PORT}`)
    checkMysqlConnection();
})

app.use('/category', categoryApi)
app.use('/collection', collectionApi)
app.use('/company', companyApi)
app.use('/coupon', couponApi)
app.use('/order', orderApi)
app.use('/product', productApi)
app.use('/user', userApi)