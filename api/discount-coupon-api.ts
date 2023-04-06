import express from 'express';

import { CouponService } from '../services/coupon-service';

import { adminMiddleware } from '../middlewares/adminMiddleware';
import { getDiscountCouponByCodeSchema } from '../validators/discount_coupon/get-coupon';
import { makeResponse } from '../helpers/responseHelper';
import { newCouponSchema } from '../validators/new-coupon';
import { updateDiscountCouponSchema } from '../validators/discount_coupon/update-coupon';
import { deleteDiscountCouponSchema } from '../validators/discount_coupon/delete-coupon';
import { verifyToken } from '../middlewares/verifyToken';

const couponApi = express.Router();
const service = new CouponService();

couponApi.get('/:coupon_code', verifyToken, async (req, res) => {   
    try {
        const {error, value} = await getDiscountCouponByCodeSchema.validateAsync(req.params)

        if (!error) {
            const { coupon_code } = req.params
            const coupon = await service.getDiscountCouponByCode(coupon_code)
            if (coupon) {
                return makeResponse(res, 200, coupon, true, null)
            } else {
                return makeResponse(res, 404, null, false, ['Coupon not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, err, false, ['Internal server error'])
    }
})

couponApi.post("/", verifyToken, async (req, res) => {   
    try {
        const {error, value} = await newCouponSchema.validateAsync(req.body)
        if (!error) {
            let { 
                company_id,
                coupon_code,
                percentage,
                is_active } = req.body
            const success = await service.createDiscountCoupon(company_id, coupon_code.trim(), percentage, is_active)
            if (success) {
                return makeResponse(res, 201, null, true, null)
            } else {
                return makeResponse(res, 400, null, false, ['Bad request'])
            }
        }
    } catch (err) {
        console.log(err)
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

couponApi.put("/:coupon_id", verifyToken, async (req, res) => {   
    try {
        const {error, value} = await updateDiscountCouponSchema.validateAsync({...req.body, ...req.params})
        if (!error) {
            let { 
                coupon_code,
                percentage,
                is_active } = req.body
            let { coupon_id } = req.params
            const coupon = await service.getDiscountCouponById(Number(coupon_id));
            console.log(coupon)
            if (coupon) {
                const success = await service.updateDiscountProduct(Number(coupon_id), coupon_code.trim(), percentage, is_active)
                if (success) {
                    return makeResponse(res, 200, null, true, null)
                } else {
                    return makeResponse(res, 409, null, false, ['Conflict'])
                }
            } else {
                return makeResponse(res, 404, null, false, ['Coupon not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        console.log(err)
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

couponApi.delete("/:coupon_id", verifyToken, async (req, res) => {   
    try {
        const {error, value} = await deleteDiscountCouponSchema.validateAsync(req.params)
    
        if (!error) {
            let { coupon_id } = req.params
            const coupon = await service.getDiscountCouponById(Number(coupon_id))
            if (coupon) {
                const success = await service.deleteDiscountCoupon(Number(coupon_id))
                if (success) {
                    return makeResponse(res, 200, null, true, null)
                } else {
                    return makeResponse(res, 409, null, false, ['Conflict'])
                }
            } else {
                return makeResponse(res, 404, null, false, ['Coupon not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

export = couponApi