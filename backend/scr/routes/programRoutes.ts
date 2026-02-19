import { Router } from 'express';
import { 
  createProgramController, 
  getAllProgramsController, 
  getProgramController, 
  updateProgramController, 
  deleteProgramController 
} from '../controllers/programController';
import { authenticateToken, requireAdmin, requireSchoolCounselor } from '../middlewares/auth';

const router = Router();

// Program routes - admin and school counselor can access
router.post('/', authenticateToken, requireAdmin, createProgramController);
router.get('/', authenticateToken, requireAdmin, getAllProgramsController);
router.get('/', authenticateToken, requireSchoolCounselor, getAllProgramsController);
router.get('/:id', authenticateToken, requireAdmin, getProgramController);
router.get('/:id', authenticateToken, requireSchoolCounselor, getProgramController);
router.put('/:id', authenticateToken, requireAdmin, updateProgramController);
router.put('/:id', authenticateToken, requireSchoolCounselor, updateProgramController);
router.delete('/:id', authenticateToken, requireAdmin, deleteProgramController);
router.delete('/:id', authenticateToken, requireSchoolCounselor, deleteProgramController);

export default router;
