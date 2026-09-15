const { execSync } = require('child_process');
const path = require('path');

const gitExe = 'C:\\Users\\texta\\AppData\\Local\\Programs\\Git\\cmd\\git.exe';
const remoteUrl = 'https://github.com/Aishwarya-9Xb47T/ChaptersOfMe.git';

function runGit(args) {
  console.log(`> git ${args}`);
  return execSync(`"${gitExe}" ${args}`, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
}

try {
  runGit('init');
  runGit('config user.name "Aishwarya-9Xb47T"');
  runGit('config user.email "nsaishwarya777@gmail.com"');

  // Check if origin exists
  try {
    runGit('remote remove origin');
  } catch (e) {
    // origin did not exist, fine
  }

  runGit(`remote add origin ${remoteUrl}`);
  runGit('add .');
  runGit('status -s');
  runGit('commit -m "Initial commit: Chapters of Me blog with customized profile, enhanced writings, and secure Author Studio"');
  runGit('branch -M main');
  console.log('\nReady to push. Attempting push to origin main...');
  runGit('push -u origin main');
  console.log('\nPush successful!');
} catch (err) {
  console.error('\nGit operation encountered an error:', err.message);
}
