import { Request, Response } from 'express';
import { createSchool, getAllSchools, getSchoolById, updateSchool, deleteSchool } from '../services/schoolService';

export const createSchoolController = async (req: Request, res: Response) => {
  try {
    const { name, abbreviation, description } = req.body;
    
    const schoolData = {
      name,
      abbreviation: abbreviation.toUpperCase(),
      description,
      isActive: true
    };
    
    const school = await createSchool(schoolData);
    
    res.status(201).json({
      success: true,
      message: 'School created successfully',
      school
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create school'
    });
  }
};

export const getAllSchoolsController = async (req: Request, res: Response) => {
  try {
    const schools = await getAllSchools();
    
    res.status(200).json({
      success: true,
      schools
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get schools'
    });
  }
};

export const getSchoolController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const school = await getSchoolById(id);
    
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }
    
    res.status(200).json({
      success: true,
      school
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get school'
    });
  }
};

export const updateSchoolController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, abbreviation, description } = req.body;
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (abbreviation) updateData.abbreviation = abbreviation.toUpperCase();
    if (description !== undefined) updateData.description = description;
    
    const school = await updateSchool(id, updateData);
    
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'School updated successfully',
      school
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update school'
    });
  }
};

export const deleteSchoolController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await deleteSchool(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'School deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete school'
    });
  }
};
