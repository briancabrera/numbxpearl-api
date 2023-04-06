import { User } from "../models/user";
import { UserService } from "./user-service";
import jsonwebtoken from 'jsonwebtoken'
import { Roles } from "../models/roles"
import { jwtSecret } from "../config/jwtSecret";
import bcrypt from 'bcryptjs'

export class AuthService {

    private userService: UserService = new UserService();

    constructor () {}

    public async login(email: string, password: string) {
        const data = {
            success: true,
            status: 200,
            token: ''
        }

        const user = await this.userService.getUserByEmail(email);

        if (user) {
            const role = await this.userService.getUserRole(user['user_id'])

            if (role && role['user_type_name'] === Roles.SUPERADMIN ) {
                const match = await bcrypt.compare(password, user['password'])
                if (match) {
                    data.token = jsonwebtoken.sign({
                        email: user['email'],
                        user_id: user['user_id'],
                        document: user['document']
                    }, jwtSecret, { expiresIn: '1h' })
                }
            } else {
                data.success = false;
                data.status = 400;
            }
        } else {
            data.success = false;
            data.status = 400;
        }

        return data
    }

    public async register(
        user_type_id: number,
        firstname: string,
        lastname: string,
        email: string,
        phone: string,
        password: string,
        document: string
    ) {
        let data = {
            success: true,
            status: 201,
            token: null
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await this.userService.createAdmin(user_type_id,
            firstname,
            lastname, 
            email, 
            phone, 
            hashedPassword, 
            document
        )

        if (newUser) {
            const login = await this.login(email, password)
            data = {
                ...login
            }
        } else {
            data.status = 400,
            data.success = false
        }

        return data
    }

}