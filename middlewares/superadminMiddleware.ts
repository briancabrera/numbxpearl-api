import express from 'express';
import MySqlConnection from '../core/mysqlConnection';
import { makeResponse } from "../helpers/responseHelper";
import { Roles } from "../models/roles"
import { UserService } from '../services/user-service';


export async function superadminMiddleware(request: express.Request, response: express.Response, next: express.NextFunction){
    const { user_id } = request.headers;

    const service = new UserService();
    const userRole = await service.getUserRole(user_id);

    if(userRole && userRole['user_type_name'] === Roles.SUPERADMIN){
        next();
    } else { 
        return makeResponse(response, 403, null, false, ["Unauthorized"]);
    }
}