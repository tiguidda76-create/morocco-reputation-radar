import fs from 'fs';
import path from 'path';

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      checkDir(full);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        const m = line.match(/from\s+['"](\.\.?\/[^'"]+)['"]/);
        if (m) {
          const importPath = m[1];
          const resolvedDir = path.dirname(full);
          const tryExtensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
          let found = false;
          for (const ext of tryExtensions) {
            const candidate = path.resolve(resolvedDir, importPath + ext);
            if (fs.existsSync(candidate)) {
              found = true;
              const segments = path.relative(path.resolve('.'), candidate).split(path.sep);
              let cur = path.resolve('.');
              for (const seg of segments) {
                if (seg === '.' || seg === '..') continue;
                const dirEntries = fs.readdirSync(cur);
                if (!dirEntries.includes(seg)) {
                  console.log(`CASE MISMATCH in ${path.relative('.', full)}:${idx + 1} -> imported: "${importPath}" (mismatched segment "${seg}" vs "${dirEntries.find(e => e.toLowerCase() === seg.toLowerCase())}")`);
                }
                cur = path.join(cur, seg);
              }
              break;
            }
          }
          if (!found) {
            console.log(`NOT FOUND in ${path.relative('.', full)}:${idx + 1} -> "${importPath}"`);
          }
        }
      });
    }
  }
}

console.log('Starting case-sensitivity inspection...');
checkDir(path.resolve('src'));
console.log('Inspection finished.');
