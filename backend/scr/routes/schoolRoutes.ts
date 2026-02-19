import { Router } from 'express';
import { 
  createSchoolController, 
  getAllSchoolsController, 
  getSchoolController, 
  updateSchoolController, 
  deleteSchoolController 
} from '../controllers/schoolController';
import { authenticateToken, requireAdmin, requireSchoolCounselor } from '../middlewares/auth';

const router = Router();

// School routes - admin and school counselor can access
router.post('/', authenticateToken, requireAdmin, createSchoolController);
router.get('/', authenticateToken, requireAdmin, getAllSchoolsController);
router.get('/', authenticateToken, requireSchoolCounselor, getAllSchoolsController);
router.get('/:id', authenticateToken, requireAdmin, getSchoolController);
router.get('/:id', authenticateToken, requireSchoolCounselor, getSchoolController);
router.put('/:id', authenticateToken, requireAdmin, updateSchoolController);
router.put('/:id', authenticateToken, requireSchoolCounselor, updateSchoolController);
router.delete('/:id', authenticateToken, requireAdmin, deleteSchoolController);
router.delete('/:id', authenticateToken, requireSchoolCounselor, deleteSchoolController);

export default router;
