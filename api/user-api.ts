import express from 'express';

import { superadminMiddleware } from '../middlewares/superadminMiddleware';
import { UserService } from '../services/user-service';

import { newUserSchema, updateUserSchema, getUserByDocumentSchema } from '../validators/user/index';

import { makeResponse } from '../helpers/responseHelper';


const userApi = express.Router();
const service = new UserService();

userApi.get('/', superadminMiddleware, async (req, res) => {
    try {
        const users = await service.getUsers();
        if (users) {
            return makeResponse(res, 200, users, true, null)
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, err, false, ['Internal server error'])
    }
})

userApi.get('/:document', async (req, res) => {   
    try {
        const {error, value} = await getUserByDocumentSchema.validateAsync(req.params)

        if (!error) {
            const { document } = req.params
            const user = await service.getUserByDocument(document)
            if (user) {
                return makeResponse(res, 200, user, true, null)
            } else {
                return makeResponse(res, 404, null, false, ['User not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, err, false, ['Internal server error'])
    }
})

userApi.post("/", async (req, res) => {   
    try {
        const {error, value} = await newUserSchema.validateAsync(req.body)
    
        if (!error) {
            const { firstname, lastname, email, phone, document } = req.body
            const userExists = await service.getUserByDocument(document)
            if (!userExists) {
                const success = await service.createUser(firstname, lastname, email, phone, document)
                if (success) {
                    const user = await service.getUserByDocument(document)
                    return makeResponse(res, 201, user, true, null)
                } else {
                    return makeResponse(res, 400, null, false, ['Bad request'])
                }
            } else {
                return makeResponse(res, 409, null, false, ['User already exists'])
            }
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

userApi.put("/:id", async (req, res) => {   
    try {
        const {error, value} = await updateUserSchema.validateAsync(req.body)
    
        if (!error) {
            const updatedUser = await service.updateUser(req, res)
            return makeResponse(res, 200, updatedUser, true, null)
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

userApi.delete("/:id", superadminMiddleware, async (req, res) => {   
    try {
        const {error, value} = await updateUserSchema.validateAsync(req.body)
    
        if (!error) {
            const deletedUser = await service.deleteUser(req, res)
            return makeResponse(res, 201, null, true, null)
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

export = userApi