// Configuration Verification Script
// Run with: node verify-config.js

require('dotenv').config();

const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON_KEY',
  'REACT_APP_HOUSEHOLD_ID',
];

console.log('🔍 Verifying Together OS Configuration...\n');

let hasErrors = false;

// Check if .env file exists
const fs = require('fs');
if (!fs.existsSync('.env')) {
  console.error('❌ .env file not found!');
  console.log('   Create it by copying .env.example');
  process.exit(1);
}

// Check all required environment variables
requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar];

  if (!value) {
    console.error(`❌ Missing: ${envVar}`);
    hasErrors = true;
  } else if (value.includes('your_') || value.includes('placeholder')) {
    console.error(`❌ Not configured: ${envVar} (still has placeholder value)`);
    hasErrors = true;
  } else {
    console.log(`✅ ${envVar}: ${value.substring(0, 20)}...`);
  }
});

console.log('\n🔐 Security Checks:\n');

// Check Firebase config doesn't have hardcoded values
const firebaseConfigPath = './src/config/firebase.js';
const firebaseConfig = fs.readFileSync(firebaseConfigPath, 'utf8');

if (firebaseConfig.includes('AIzaSy') || firebaseConfig.includes('"your')) {
  console.error('❌ SECURITY ISSUE: firebase.js contains hardcoded credentials!');
  hasErrors = true;
} else {
  console.log('✅ firebase.js uses environment variables');
}

// Check Supabase config doesn't have hardcoded values
const supabaseConfigPath = './src/config/supabase.js';
const supabaseConfig = fs.readFileSync(supabaseConfigPath, 'utf8');

if (supabaseConfig.includes('https://') && !supabaseConfig.includes('process.env')) {
  console.error('❌ SECURITY ISSUE: supabase.js contains hardcoded credentials!');
  hasErrors = true;
} else {
  console.log('✅ supabase.js uses environment variables');
}

// Check .gitignore includes .env
const gitignorePath = './.gitignore';
const gitignore = fs.readFileSync(gitignorePath, 'utf8');

if (!gitignore.includes('.env')) {
  console.error('❌ SECURITY ISSUE: .env is not in .gitignore!');
  hasErrors = true;
} else {
  console.log('✅ .env is in .gitignore');
}

console.log('\n📊 Configuration Summary:\n');

console.log(`Firebase Project: ${process.env.REACT_APP_FIREBASE_PROJECT_ID || 'NOT SET'}`);
console.log(`Supabase URL: ${process.env.REACT_APP_SUPABASE_URL || 'NOT SET'}`);
console.log(`Household ID: ${process.env.REACT_APP_HOUSEHOLD_ID || 'NOT SET'}`);

if (hasErrors) {
  console.log('\n❌ Configuration has errors. Fix them before running the app.\n');
  process.exit(1);
} else {
  console.log('\n✅ All checks passed! Your configuration is secure.\n');
  console.log('Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm start');
  console.log('3. Sign in with your Firebase credentials\n');
}
