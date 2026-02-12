import express from 'express';
import { createCompany, getCompanies, getCompanyById, joinCompany, updateCompany } from '../controllers/companyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, createCompany)
  .get(getCompanies);

router.put('/join', protect, joinCompany);

router.route('/:id')
  .get(getCompanyById)
  .put(protect, updateCompany);

export default router;
