#!/usr/bin/env node
// Helper script to check Node version and provide helpful error messages
// Updated for Vite migration - now supports Node.js 18+

const nodeVersion = process.version.match(/^v(\d+)/);
const majorVersion = nodeVersion ? parseInt(nodeVersion[1]) : 0;

if (majorVersion < 18) {
  console.error('\n❌ Node.js version too old.');
  console.error('   This project now uses Vite, which requires Node.js 18 or newer.\n');
  console.error('   Quick fix:');
  console.error('   - If using fnm: fnm use 18 (or newer)');
  console.error('   - If using nvm: nvm use 18 (or newer)');
  console.error('   - Then run: npm install && npm run dev\n');
  process.exit(1);
}

// Version is OK, continue
process.exit(0);

