import express from 'express';
import { CouponService } from '../services/coupon-service';

const couponApi = express.Router();
const service = new CouponService();

couponApi.get('/', (req, res) => service.getCoupons(req, res))

couponApi.get('/:id', (req, res) => service.getCoupon(req, res))

couponApi.post("/", (req, res) => service.createCoupon(req, res))

couponApi.put("/:id", (req, res) => service.updateCoupon(req, res))

couponApi.delete("/:id", (req, res) => service.deleteCoupon(req, res))

export = couponApi