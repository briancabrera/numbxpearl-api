import express from 'express';
import { CompanyService } from '../services/company-service';

const companyApi = express.Router();
const service = new CompanyService();

companyApi.get('/', (req, res) => res.status(503).send())

companyApi.get('/:id', (req, res) => res.status(503).send())

companyApi.post("/", (req, res) => res.status(503).send())

companyApi.put("/:id", (req, res) => res.status(503).send())

companyApi.delete("/:id", (req, res) => res.status(503).send())

export = companyApi