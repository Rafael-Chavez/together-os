// Quick environment variable checker
// Run this to see what values are being loaded

console.log('🔍 Checking Environment Variables...\n');

const vars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_HOUSEHOLD_ID'
];

vars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 30)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\n💡 If variables show "NOT SET", the .env file is not being loaded.');
console.log('💡 Make sure you restart the dev server after changing .env!');
