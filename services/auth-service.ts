import { User } from "../models/user";
import { UserService } from "./user-service";
import { compare } from "../helpers/comparePassword";
import jsonwebtoken from 'jsonwebtoken'
import { Roles } from "../models/roles"
import { jwtSecret } from "../config/jwtSecret";

export class AuthService {

    private userService: UserService

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
                const match = compare(password, user['password'])

                if (match) {
                    data.token = jsonwebtoken.sign({
                        email: user['email'],
                        user_id: user['user_id'],
                        document: user['document']
                    }, jwtSecret, { expiresIn: '1h' })
                }
            }
        } else {
            data.success = false;
            data.status = 400;
        }

        return data
    }

}