import express from 'express';
import { OrderService } from '../services/order-service';

const orderApi = express.Router();
const service = new OrderService();

orderApi.get('/', (req, res) => service.getOrders(req, res))

orderApi.get('/:id', (req, res) => service.getOrder(req, res))

orderApi.post("/", (req, res) => service.createOrder(req, res))

orderApi.put("/:id", (req, res) => service.updateOrder(req, res))

orderApi.delete("/:id", (req, res) => service.deleteOrder(req, res))

export = orderApi