/**
 * Test script to verify children checkbox functionality
 * This script will test the new array-based children field
 */

const testProfile = {
  // Basic info
  firstName: "ChildrenTest",
  lastName: "CheckboxTest",
  age: 28,
  gender: "female",
  height: "5'4&quot;",
  location: "Santo Domingo, Dominican Republic",
  
  // Test multiple children selections
  children: ["Have children", "Want children"],
  
  // Other required fields
  relationshipStatus: "Single",
  smoking: "Non-smoker",
  bodyType: "Average",
  drinking: "Socially",
  education: "Bachelor's Degree",
  occupation: "Full Time",
  languages: ["Spanish", "English"],
  lookingFor: ["Serious relationship"],
  aboutMe: "Testing multiple children checkbox selections",
  interests: ["Family", "Travel"],
  
  // Media arrays (empty for test)
  photos: [],
  videos: [],
  
  // Contact methods
  contactMethods: {
    whatsapp: "+1-809-555-0124",
    email: "testchildren@example.com"
  },
  
  // Agreement
  combinedAgreement: true,
  contactSharingConsent: true
};

// Test function to create profile
async function testChildrenCheckbox() {
  try {
    console.log('Testing children checkbox with multiple selections:');
    console.log('- children:', testProfile.children);
    
    const response = await fetch('http://localhost:5000/api/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testProfile)
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Profile creation failed:', error);
      return null;
    }
    
    const createdProfile = await response.json();
    console.log('✅ Profile created successfully with ID:', createdProfile.id);
    console.log('Children field verification:');
    console.log('- children (array):', createdProfile.children);
    console.log('- children length:', createdProfile.children.length);
    console.log('- children type:', typeof createdProfile.children);
    
    return createdProfile;
  } catch (error) {
    console.error('Error testing children checkbox:', error);
    return null;
  }
}

// Run the test
console.log('🧪 Starting Children Checkbox Test...');
testChildrenCheckbox().then(profile => {
  if (profile) {
    console.log('✅ Test completed. Profile ID:', profile.id);
    console.log('🔍 Next step: Edit this profile in admin panel to verify checkbox functionality');
  } else {
    console.log('❌ Test failed');
  }
});