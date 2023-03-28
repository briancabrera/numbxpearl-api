import { User } from "../models/user";
import { UserService } from "./user-service";
import { compare } from "../helpers/comparePassword";
import jsonwebtoken from 'jsonwebtoken'
import { Roles } from "../models/roles"
import { jwtSecret } from "../config/jwtSecret";

export class AuthService {

    private userService: UserService

    constructor () {}

}