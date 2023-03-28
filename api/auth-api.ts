import express from 'express';

import { superadminMiddleware } from '../middlewares/superadminMiddleware';
import { AuthService } from '../services/auth-service';

import { makeResponse } from '../helpers/responseHelper';


const authApi = express.Router();
const service = new AuthService();

export = authApi