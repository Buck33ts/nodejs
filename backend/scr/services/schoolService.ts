import School, { ISchool } from "../models/schoolModel";

export const createSchool = async (schoolData: Omit<ISchool, '_id' | 'createdAt' | 'updatedAt'>): Promise<ISchool> => {
  const existingSchool = await School.findOne({ 
    $or: [
      { name: schoolData.name },
      { abbreviation: schoolData.abbreviation }
    ]
  });
  
  if (existingSchool) {
    throw new Error('School with this name or abbreviation already exists');
  }
  
  const school = await School.create(schoolData);
  return school;
};

export const getAllSchools = async (): Promise<ISchool[]> => {
  return School.find({ isActive: true }).sort({ name: 1 });
};

export const getSchoolById = async (schoolId: string): Promise<ISchool | null> => {
  return School.findOne({ _id: schoolId, isActive: true });
};

export const updateSchool = async (schoolId: string, updateData: Partial<ISchool>): Promise<ISchool | null> => {
  const school = await School.findByIdAndUpdate(
    schoolId, 
    updateData, 
    { new: true, runValidators: true }
  );
  return school;
};

export const deleteSchool = async (schoolId: string): Promise<boolean> => {
  const result = await School.findByIdAndUpdate(
    schoolId, 
    { isActive: false }, 
    { new: true }
  );
  return !!result;
};
