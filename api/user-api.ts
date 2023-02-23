import express from 'express';
import { UserService } from '../services/user-service';

const userApi = express.Router();
const service = new UserService();

userApi.get('/', (req, res) => service.getUsers(req, res))

userApi.get('/:id', (req, res) => service.getUser(req, res))

userApi.post("/", (req, res) => service.createUser(req, res))

userApi.put("/:id", (req, res) => service.updateUser(req, res))

userApi.delete("/:id", (req, res) => service.deleteUser(req, res))

export = userApi