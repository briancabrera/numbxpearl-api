import express from 'express';
import MySqlConnection from '../core/mysqlConnection';
import { makeResponse } from "../helpers/responseHelper";
import { Roles } from "../models/roles"
import { UserService } from '../services/user-service';


export async function adminMiddleware(request: express.Request, response: express.Response, next: express.NextFunction){
    const userId = request.headers.user_id;

    const service = new UserService();
    const userRole = await service.getUserRole(userId);

    if(userRole['user_type_name'] === Roles.ADMINISTRATOR || userRole['user_type_name'] === Roles.SUPERADMIN){
        next();
    } else {
        return makeResponse(response, 403, null, false, ["Unauthorized"]);
    }
}