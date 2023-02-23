import express from 'express';
import { ProductService } from '../services/product-service';

const productApi = express.Router();
const service = new ProductService();

productApi.get('/', (req, res) => service.getProducts(req, res))

productApi.get('/:id', (req, res) => service.getProduct(req, res))

productApi.post("/", (req, res) => service.createProduct(req, res))

productApi.put("/:id", (req, res) => service.updateProduct(req, res))

productApi.delete("/:id", (req, res) => service.deleteProduct(req, res))

export = productApi