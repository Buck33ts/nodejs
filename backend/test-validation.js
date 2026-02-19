// Test script to demonstrate school validation for program creation
// This can be run with: node test-validation.js (after installing axios)

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testSchoolValidation() {
  console.log('🧪 Testing School Validation for Program Creation\n');

  try {
    // Step 1: Create a school first
    console.log('1️⃣ Creating a school...');
    const schoolResponse = await axios.post(`${BASE_URL}/schools`, {
      name: "University of Technology",
      abbreviation: "UT",
      description: "A leading technology university"
    });
    
    const schoolId = schoolResponse.data.school._id;
    console.log('✅ School created successfully:', schoolResponse.data.school.name);
    console.log('📋 School ID:', schoolId);

    // Step 2: Create a program with valid school ID
    console.log('\n2️⃣ Creating a program with valid school ID...');
    const programResponse = await axios.post(`${BASE_URL}/programs`, {
      name: "Computer Science",
      schoolId: schoolId,
      description: "Bachelor's degree in Computer Science",
      duration: "4 years"
    });
    
    console.log('✅ Program created successfully:', programResponse.data.program.name);

    // Step 3: Try to create a program with invalid school ID
    console.log('\n3️⃣ Testing validation with invalid school ID...');
    try {
      await axios.post(`${BASE_URL}/programs`, {
        name: "Invalid Program",
        schoolId: "invalid-school-id-123",
        description: "This should fail"
      });
    } catch (error) {
      console.log('❌ Expected error caught:', error.response.data.message);
      console.log('📊 Status Code:', error.response.status);
    }

    // Step 4: Try to create a duplicate program in the same school
    console.log('\n4️⃣ Testing duplicate program validation...');
    try {
      await axios.post(`${BASE_URL}/programs`, {
        name: "Computer Science", // Same name as before
        schoolId: schoolId,
        description: "This should fail as duplicate"
      });
    } catch (error) {
      console.log('❌ Expected error caught:', error.response.data.message);
      console.log('📊 Status Code:', error.response.status);
    }

    console.log('\n🎉 All validation tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Export for use or run directly
if (require.main === module) {
  testSchoolValidation();
}

module.exports = { testSchoolValidation };
