import express from 'express';

import { UserService } from '../services/user-service';

import { newUserSchema, updateUserSchema, getUserByDocumentSchema, deleteUserSchema } from '../validators/user/index';
import { getAddressesSchema, updateAddressSchema, createAddressSchema, deleteAddressSchema } from '../validators/address';

import { makeResponse } from '../helpers/responseHelper';
import { verifyToken } from '../middlewares/verifyToken';


const userApi = express.Router();
const service = new UserService();

userApi.get('/', verifyToken, async (req, res) => {
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
            let { 
                firstname,
                lastname, 
                email, 
                phone, 
                document } = req.body
            const userExists = await service.getUserByDocument(document)
            if (!userExists) {
                const success = await service.createUser(firstname.trim(), lastname.trim(), email.trim(), phone.trim(), document.trim())
                if (success) {
                    return makeResponse(res, 201, null, true, null)
                } else {
                    return makeResponse(res, 400, null, false, ['Bad request'])
                }
            } else {
                return makeResponse(res, 409, null, false, ['User already exists'])
            }
        }
    } catch (err) {
        console.log(err)
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

userApi.put("/:user_id", verifyToken, async (req, res) => {   
    try {
        const {error, value} = await updateUserSchema.validateAsync({...req.body, ...req.params})
        if (!error) {
            let { 
                firstname,
                lastname,
                email,
                phone } = req.body
            let { user_id } = req.params
            const user = await service.getUserById(Number(user_id));
            if (user) {
                const success = await service.updateUser(Number(user_id), firstname.trim(), lastname.trim(), email.trim(), phone.trim())
                if (success) {
                    return makeResponse(res, 200, null, true, null)
                } else {
                    return makeResponse(res, 409, null, false, ['Conflict'])
                }
            } else {
                return makeResponse(res, 404, null, false, ['User not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

userApi.delete("/:user_id", verifyToken, async (req, res) => {   
    try {
        const {error, value} = await deleteUserSchema.validateAsync(req.params)
    
        if (!error) {
            let { user_id } = req.params
            const user = await service.getUserById(Number(user_id))
            if (user) {
                const success = await service.deleteUser(Number(user_id))
                if (success) {
                    return makeResponse(res, 200, null, true, null)
                } else {
                    return makeResponse(res, 409, null, false, ['Conflict'])
                }
            } else {
                return makeResponse(res, 404, null, false, ['User not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

userApi.get("/:user_id/address", async (req, res) => {
    try {
        const {error, value} = await getAddressesSchema.validateAsync(req.params)

        if (!error) {
            const { user_id } = req.params
            const user = await service.getUserById(Number(user_id));
            if (user) {
                const addresses = await service.getUserAddresses(Number(user_id))
                if (addresses) {
                    return makeResponse(res, 200, addresses, true, null)
                } else {
                    return makeResponse(res, 404, null, false, ['No addresses found for the user'])
                }
            } else {
                return makeResponse(res, 404, null, false, ['User not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch(err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

userApi.post("/:user_id/address", async (req, res) => {   
    try {
        const {error, value} = await createAddressSchema.validateAsync({...req.body, ...req.params})
        if (!error) {
            let { country_id, department_id, address } = req.body
            let { user_id } = req.params
            const user = await service.getUserById(Number(user_id));
            if (user) {
                const success = await service.createUserAddress(country_id, department_id, address.toLowerCase().trim(), Number(user_id))
                console.log("success", success)
                if (success) {
                    return makeResponse(res, 201, null, true, null)
                } else {
                    return makeResponse(res, 409, null, false, ['Conflict'])
                }
            } else {
                return makeResponse(res, 404, null, false, ['User not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

userApi.put("/:user_id/address/:address_id", async (req, res) => {   
    try {
        const {error, value} = await updateAddressSchema.validateAsync({...req.body, ...req.params})
    
        if (!error) {
            let { country_id, department_id, address } = req.body
            let { user_id, address_id } = req.params
            const user = await service.getUserById(Number(user_id));
            if (user) {
                const success = await service.updateUserAddress(Number(address_id), country_id, department_id, address.toLowerCase().trim())
                if (success) {
                    return makeResponse(res, 200, null, true, null)
                } else {
                    return makeResponse(res, 409, null, false, ['Conflict'])
                }
            } else {
                return makeResponse(res, 404, null, false, ['User not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

userApi.delete("/:user_id/address/:address_id", async (req, res) => {   
    try {
        const {error, value} = await deleteAddressSchema.validateAsync(req.params)
    
        if (!error) {
            let { user_id, address_id } = req.params
            const user = await service.getUserById(Number(user_id));
            if (user) {
                const success = await service.deleteUserAddress(Number(address_id))
                if (success) {
                    return makeResponse(res, 200, null, true, null)
                } else {
                    return makeResponse(res, 409, null, false, ['Conflict'])
                }
            } else {
                return makeResponse(res, 404, null, false, ['User not found'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch (err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

export = userApi