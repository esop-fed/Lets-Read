const { spawn } = require('child_process');

// Copied './app/components' to './quantex-design/components'
spawn('nodemon', ["-w", "app/components", "-e", "js,jsx,scss,md", "sync.design.js"], { shell: true, env: process.env, stdio: 'inherit' })
  .on('close', code => process.exit(code))
  .on('error', spawnError => console.error(spawnError));
// build quantex-design
spawn('npm', ["start", "--prefix", "../quantex-design"], { shell: true, env: process.env, stdio: 'inherit' })
  .on('close', code => process.exit(code))
  .on('error', spawnError => console.error(spawnError));
