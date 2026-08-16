import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'node:fs';

const dir = process.cwd();
const url = 'https://github.com/tiguidda76-create/morocco-reputation-radar.git';
const token = process.env.GITHUB_TOKEN || process.argv[2];

async function pushToGitHub() {
  if (!token) {
    console.log('Usage: node git-push.mjs <GITHUB_TOKEN>');
    process.exit(1);
  }

  const activeBranch = (await git.currentBranch({ fs, dir })) || 'main';
  console.log(`Pushing branch ${activeBranch} to ${url}...`);

  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    url: url,
    ref: activeBranch,
    remoteRef: 'main',
    force: true,
    onAuth: () => ({
      username: 'tiguidda76-create',
      password: token,
    }),
  });

  console.log('Push status:', pushResult.ok ? 'SUCCESS' : 'FAILED');
}

pushToGitHub().catch((err) => {
  console.error('Error during push:', err.message || err);
});
