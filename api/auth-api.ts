import express from 'express';

import { AuthService } from '../services/auth-service';

import { makeResponse } from '../helpers/responseHelper';
import { loginSchema, registerSchema } from '../validators/user';
import { UserService } from '../services/user-service';


const authApi = express.Router();
const service = new AuthService();

authApi.post("/login", async (req, res) => {   
    try {
        const {error, value} = await loginSchema.validateAsync(req.body)
    
        if (!error) {
            console.log("hola")
            let { email, password } = req.body
            email = email.trim()
            password = password.trim()
            const logged = await service.login(email,password)
            if (logged.success) {
                return makeResponse(res, 200, logged.token, true, null)
            } else {
                return makeResponse(res, 400, null, false, ['Bad request'])
            }
        }
    } catch (err) {
        console.log(err)
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

authApi.post("/register", async (req, res) => {   
    try {
        const {error, value} = await registerSchema.validateAsync(req.body)
    
        if (!error) {
            let { user_type_id,
                email,
                firstname,
                lastname,
                phone,
                document,
                password
                } = req.body

            firstname = firstname.trim()
            lastname = lastname.trim()
            phone = phone.trim()
            document = document.trim()
            email = email.trim()
            password = password.trim()

            const userService = new UserService()
            const userExists = await userService.getUserByEmail(email)

            if (!userExists) {
                const register = await service.register(
                    user_type_id,
                    firstname,
                    lastname,
                    email,
                    phone,
                    password,
                    document
                )

                return makeResponse(res, register.status, register.token, register.success)

            } else {
                return makeResponse(res, 409, null, false, ['User already registered, email in use'])
            }
        }
    } catch (err) {
        console.log(err)
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})


export = authApi