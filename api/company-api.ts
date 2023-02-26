import express from 'express';
import { makeResponse } from '../helpers/responseHelper';
import { superadminMiddleware } from '../middlewares/superadminMiddleware';
import { CollectionService } from '../services/collection-service';
import { CompanyService } from '../services/company-service';
import { getCompanyCollectionsSchema } from '../validators/collection';

const companyApi = express.Router();

companyApi.get('/', (req, res) => res.status(503).send())

companyApi.get('/:id', (req, res) => res.status(503).send())

companyApi.post("/", superadminMiddleware, (req, res) => res.status(503).send())

companyApi.put("/:id", superadminMiddleware, (req, res) => res.status(503).send())

companyApi.delete("/:id", superadminMiddleware, (req, res) => res.status(503).send())

companyApi.get('/:company_id/collections', async (req, res) => {
    try {
        const {error, value} = await getCompanyCollectionsSchema.validateAsync(req.params)
        const service = new CollectionService();
        
        if (!error) {
            const { company_id } = req.params
            const collections = await service.getCompanyCollections(company_id)
            if (collections) {
                return makeResponse(res, 200, collections, true, null)
            } else {
                return makeResponse(res, 404, null, false, ['No collections found for the company'])
            }
        } else {
            return makeResponse(res, 400, null, false, ['Bad request'])
        }
    } catch(err) {
        return makeResponse(res, 500, null, false, ['Internal server error'])
    }
})

export = companyApi