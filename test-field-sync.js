/**
 * Test script to verify field sync between submit-profile and admin edit
 * This script will test the problematic fields: gender, height, smoking, bodyType, children, relationshipStatus
 */

const testProfile = {
  // Basic info
  firstName: "FinalSync",
  lastName: "Test",
  age: 26,
  gender: "female",
  height: "5'0&quot;",
  location: "Santo Domingo, Dominican Republic",
  
  // The problematic fields we need to test
  relationshipStatus: "Single",
  children: "No children",
  smoking: "Non-smoker",
  bodyType: "Athletic",
  drinking: "Socially",
  
  // Other required fields
  education: "Bachelor's Degree",
  occupation: "Engineer",
  languages: ["Spanish", "English"],
  lookingFor: ["Serious relationship"],
  aboutMe: "Testing field sync functionality",
  interests: ["Technology", "Travel"],
  
  // Media arrays (empty for test)
  photos: [],
  videos: [],
  
  // Contact methods
  contactMethods: {
    whatsapp: "+1-809-555-0123",
    email: "test@example.com"
  },
  
  // Agreement
  combinedAgreement: true,
  contactSharingConsent: true
};

// Test function to create profile
async function testProfileCreation() {
  try {
    console.log('Testing profile creation with fields:');
    console.log('- gender:', testProfile.gender);
    console.log('- height:', testProfile.height);
    console.log('- drinking:', testProfile.drinking);
    console.log('- smoking:', testProfile.smoking);
    console.log('- bodyType:', testProfile.bodyType);
    console.log('- children:', testProfile.children);
    console.log('- relationshipStatus:', testProfile.relationshipStatus);
    
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
    console.log('Field verification:');
    console.log('- gender:', createdProfile.gender);
    console.log('- height:', createdProfile.height);
    console.log('- drinking:', createdProfile.drinking);
    console.log('- smoking:', createdProfile.smoking);
    console.log('- bodyType:', createdProfile.bodyType);
    console.log('- children:', createdProfile.children);
    console.log('- relationshipStatus:', createdProfile.relationshipStatus);
    
    return createdProfile;
  } catch (error) {
    console.error('Error testing profile creation:', error);
    return null;
  }
}

// Run the test
console.log('🧪 Starting Field Sync Test...');
testProfileCreation().then(profile => {
  if (profile) {
    console.log('✅ Test completed. Profile ID:', profile.id);
    console.log('🔍 Next step: Edit this profile in admin panel at /admin to verify field sync');
  } else {
    console.log('❌ Test failed');
  }
});