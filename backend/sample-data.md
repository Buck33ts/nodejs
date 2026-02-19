# Sample Data for Testing

## Create School
```bash
POST /api/schools
Content-Type: application/json

{
  "name": "University of Technology",
  "abbreviation": "UT",
  "description": "A leading technology university focused on innovation and research"
}
```

## Create Program (use the school ID from the response above)
```bash
POST /api/programs
Content-Type: application/json

{
  "name": "Computer Science",
  "schoolId": "SCHOOL_ID_HERE",
  "description": "Bachelor's degree in Computer Science with focus on software engineering",
  "duration": "4 years"
}
```

## Additional Sample Schools
```json
{
  "name": "Business Institute",
  "abbreviation": "BI",
  "description": "Premier business school offering management and finance programs"
}

{
  "name": "Medical College",
  "abbreviation": "MC",
  "description": "Leading medical college with state-of-the-art facilities"
}
```

## Additional Sample Programs
```json
{
  "name": "Business Administration",
  "schoolId": "BUSINESS_SCHOOL_ID",
  "description": "MBA program with specialization in strategic management",
  "duration": "2 years"
}

{
  "name": "Medicine",
  "schoolId": "MEDICAL_SCHOOL_ID", 
  "description": "Doctor of Medicine program with clinical rotations",
  "duration": "6 years"
}

{
  "name": "Information Technology",
  "schoolId": "TECH_SCHOOL_ID",
  "description": "Bachelor's degree in IT with focus on network security",
  "duration": "4 years"
}
```

## Test Cases

### Valid Program Creation
- School exists: ✅ Should create program successfully
- School is active: ✅ Should create program successfully

### Invalid Program Creation  
- School doesn't exist: ❌ Should return "School not found or inactive"
- School exists but is inactive: ❌ Should return "School not found or inactive"
- Duplicate program name in same school: ❌ Should return "Program with this name already exists in this school"

### Create User with School and Program
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "password": "SecurePassword123!",
  "role": "student",
  "schoolId": "VALID_SCHOOL_ID",
  "programId": "VALID_PROGRAM_ID"
}
```
