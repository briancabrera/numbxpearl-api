import express from 'express';
import { CategoryService } from '../services/category-service';

const categoryApi = express.Router();
const service = new CategoryService();

categoryApi.get('/', (req, res) => service.getCategories(req, res))

categoryApi.get('/:id', (req, res) => service.getCategory(req, res))

categoryApi.post("/", (req, res) => service.createCategory(req, res))

categoryApi.put("/:id", (req, res) => service.updateCategory(req, res))

categoryApi.delete("/:id", (req, res) => service.deleteCategory(req, res))

export = categoryApi