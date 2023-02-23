import express from 'express';
import { superadminMiddleware } from '../middlewares/superadminMiddleware';
import { CollectionService } from '../services/collection-service';

const collectionApi = express.Router();
const service = new CollectionService();

collectionApi.get('/', (req, res) => service.getCollections(req, res))

collectionApi.get('/:id', (req, res) => service.getCollections(req, res))

collectionApi.post("/", superadminMiddleware, (req, res) => service.createCollection(req, res))

collectionApi.put("/:id", superadminMiddleware, (req, res) => service.updateCollection(req, res))

collectionApi.delete("/:id", superadminMiddleware, (req, res) => service.deleteCollection(req, res))

export = collectionApi