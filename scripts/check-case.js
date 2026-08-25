import fs from 'fs';
import path from 'path';

function checkImports(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      checkImports(fullPath);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        let targetPath = null;
        if (importPath.startsWith('.')) {
          targetPath = path.resolve(path.dirname(fullPath), importPath);
        } else if (importPath.startsWith('@/')) {
          targetPath = path.resolve('./src', importPath.substring(2));
        }
        
        if (targetPath) {
          if (!fs.existsSync(targetPath)) {
            // Check variations like .ts, .tsx, /index.ts, /index.tsx
            const exts = ['.ts', '.tsx', '/index.ts', '/index.tsx', '.js', '.jsx'];
            let found = false;
            for (const ext of exts) {
              if (fs.existsSync(targetPath + ext)) {
                targetPath += ext;
                found = true;
                break;
              }
            }
            if (!found) continue; // If totally missing, standard error
          }
          
          // Now check the exact casing of the path against the file system
          const parts = targetPath.split(path.sep);
          let currentDir = parts[0] + path.sep; // c:\
          let isCaseMatch = true;
          let actualName = null;
          let expectedName = null;

          for (let i = 1; i < parts.length; i++) {
            if (!parts[i]) continue;
            const dirFiles = fs.readdirSync(currentDir);
            if (!dirFiles.includes(parts[i])) {
              const lowerFiles = dirFiles.map(f => f.toLowerCase());
              const index = lowerFiles.indexOf(parts[i].toLowerCase());
              if (index !== -1) {
                isCaseMatch = false;
                actualName = dirFiles[index];
                expectedName = parts[i];
                break;
              } else {
                break;
              }
            }
            currentDir = path.join(currentDir, parts[i]);
          }

          if (!isCaseMatch) {
            console.log(`CASE MISMATCH in ${fullPath}:`);
            console.log(`  Imported as:   ${expectedName}`);
            console.log(`  Actual file:   ${actualName}`);
          }
        }
      }
    }
  }
}

checkImports(path.resolve('./src'));
console.log('Done checking imports.');
