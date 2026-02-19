import Program, { IProgram } from "../models/programModel";
import School from "../models/schoolModel";

export const createProgram = async (programData: Omit<IProgram, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProgram> => {
  // Verify school exists
  const school = await School.findOne({ _id: programData.schoolId, isActive: true });
  if (!school) {
    throw new Error('School not found or inactive');
  }
  
  // Check for duplicate program in same school
  const existingProgram = await Program.findOne({ 
    schoolId: programData.schoolId,
    name: programData.name,
    isActive: true
  });
  
  if (existingProgram) {
    throw new Error('Program with this name already exists in this school');
  }
  
  const program = await Program.create(programData);
  return program;
};

export const getAllPrograms = async (schoolId?: string): Promise<IProgram[]> => {
  const query: any = { isActive: true };
  
  if (schoolId) {
    query.schoolId = schoolId;
  }
  
  return Program.find(query).populate('schoolId', 'name abbreviation').sort({ name: 1 });
};

export const getProgramById = async (programId: string): Promise<IProgram | null> => {
  return Program.findOne({ _id: programId, isActive: true }).populate('schoolId', 'name abbreviation');
};

export const updateProgram = async (programId: string, updateData: Partial<IProgram>): Promise<IProgram | null> => {
  // If updating schoolId, verify new school exists
  if (updateData.schoolId) {
    const school = await School.findOne({ _id: updateData.schoolId, isActive: true });
    if (!school) {
      throw new Error('School not found or inactive');
    }
  }
  
  const program = await Program.findByIdAndUpdate(
    programId, 
    updateData, 
    { new: true, runValidators: true }
  ).populate('schoolId', 'name abbreviation');
  
  return program;
};

export const deleteProgram = async (programId: string): Promise<boolean> => {
  const result = await Program.findByIdAndUpdate(
    programId, 
    { isActive: false }, 
    { new: true }
  );
  return !!result;
};
