import express from 'express';
import asyncMiddleware from 'middleware-async';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { superadminMiddleware } from '../middlewares/superadminMiddleware';
import { ProductService } from '../services/product-service';

const productApi = express.Router();
const service = new ProductService();

productApi.get('/', (req, res) => service.getProducts(req, res))

productApi.get('/:id', (req, res) => service.getProduct(req, res))

productApi.post("/", superadminMiddleware, (req, res) => service.createProduct(req, res))

productApi.put("/:id", superadminMiddleware, (req, res) => service.updateProduct(req, res))

productApi.delete("/:id", superadminMiddleware, (req, res) => service.deleteProduct(req, res))

export = productApi