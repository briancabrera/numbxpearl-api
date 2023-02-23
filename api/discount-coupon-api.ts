import express from 'express';

import { CouponService } from '../services/coupon-service';

import { adminMiddleware } from '../middlewares/adminMiddleware';
import { superadminMiddleware } from '../middlewares/superadminMiddleware';

const couponApi = express.Router();
const service = new CouponService();

couponApi.get('/', superadminMiddleware, (req, res) => service.getCoupons(req, res))

couponApi.get('/:id', (req, res) => service.getCoupon(req, res))

couponApi.post("/", superadminMiddleware, (req, res) => service.createCoupon(req, res))

couponApi.put("/:id", superadminMiddleware, (req, res) => service.updateCoupon(req, res))

couponApi.delete("/:id", superadminMiddleware, (req, res) => service.deleteCoupon(req, res))

export = couponApi