import { Request, Response } from 'express';
import { createProgram, getAllPrograms, getProgramById, updateProgram, deleteProgram } from '../services/programService';

export const createProgramController = async (req: Request, res: Response) => {
  try {
    const { name, schoolId, description, duration } = req.body;
    
    // Validate required fields
    if (!name || !schoolId) {
      return res.status(400).json({
        success: false,
        message: 'Name and schoolId are required'
      });
    }
    
    const programData = {
      name,
      schoolId,
      description,
      duration,
      isActive: true
    };
    
    const program = await createProgram(programData);
    
    res.status(201).json({
      success: true,
      message: 'Program created successfully',
      program
    });
  } catch (error: any) {
    const statusCode = error.message.includes('School not found') ? 400 : 
                      error.message.includes('already exists') ? 409 : 400;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to create program'
    });
  }
};

export const getAllProgramsController = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const programs = await getAllPrograms(schoolId as string | undefined);
    
    res.status(200).json({
      success: true,
      programs
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get programs'
    });
  }
};

export const getProgramController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const programId = Array.isArray(id) ? id[0] : id;
    
    if (!programId) {
      return res.status(400).json({
        success: false,
        message: 'Program ID is required'
      });
    }
    
    const program = await getProgramById(programId);
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }
    
    res.status(200).json({
      success: true,
      program
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get program'
    });
  }
};

export const updateProgramController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const programId = Array.isArray(id) ? id[0] : id;
    
    if (!programId) {
      return res.status(400).json({
        success: false,
        message: 'Program ID is required'
      });
    }
    
    const { name, schoolId, description, duration } = req.body;
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (schoolId) updateData.schoolId = schoolId;
    if (description !== undefined) updateData.description = description;
    if (duration !== undefined) updateData.duration = duration;
    
    const program = await updateProgram(programId, updateData);
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Program updated successfully',
      program
    });
  } catch (error: any) {
    const statusCode = error.message.includes('School not found') ? 400 : 400;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to update program'
    });
  }
};

export const deleteProgramController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const programId = Array.isArray(id) ? id[0] : id;
    
    if (!programId) {
      return res.status(400).json({
        success: false,
        message: 'Program ID is required'
      });
    }
    
    const success = await deleteProgram(programId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete program'
    });
  }
};
