import express from 'express';
import { superadminMiddleware } from '../middlewares/superadminMiddleware';
import { CategoryService } from '../services/category-service';

const categoryApi = express.Router();
const service = new CategoryService();

categoryApi.get('/', (req, res) => service.getCategories(req, res))

categoryApi.get('/:id', (req, res) => service.getCategory(req, res))

categoryApi.post("/", superadminMiddleware, (req, res) => service.createCategory(req, res))

categoryApi.put("/:id", superadminMiddleware, (req, res) => service.updateCategory(req, res))

categoryApi.delete("/:id", superadminMiddleware, (req, res) => service.deleteCategory(req, res))

export = categoryApi