import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'node:fs';
import path from 'node:path';

const dir = process.cwd();

async function initAndCommit() {
  console.log('Initializing git repository...');
  await git.init({ fs, dir });

  console.log('Reading files to add...');
  
  function getFiles(currentDir, relativePath = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
      const entryRelative = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      if (
        entry.name === 'node_modules' ||
        entry.name === 'dist' ||
        entry.name === '.git' ||
        entry.name === '.vercel' ||
        entry.name.endsWith('.log')
      ) {
        continue;
      }
      if (entry.isDirectory()) {
        files = files.concat(getFiles(path.join(currentDir, entry.name), entryRelative));
      } else {
        files.push(entryRelative);
      }
    }
    return files;
  }

  const allFiles = getFiles(dir);
  console.log(`Adding ${allFiles.length} project files...`);

  for (const filepath of allFiles) {
    await git.add({ fs, dir, filepath });
  }

  console.log('Committing changes...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Hassan Tiguidda',
      email: 'tiguidda76@gmail.com',
    },
    message: 'feat: Morocco Radar SaaS Platform (Morocco Reputation Agency)',
  });

  console.log('Committed successfully with SHA:', sha);
}

initAndCommit().catch(console.error);
