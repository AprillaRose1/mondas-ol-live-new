import fs from 'fs';
import path from 'path';

const root = path.join(process.cwd(), 'src');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry.name)) fixFile(full);
  }
}

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  const rules = [
    [/from ['"]\.\.\/\.\.\/\.\.\/lib\//g, "from '@/lib/"],
    [/from ['"]\.\.\/\.\.\/lib\//g, "from '@/lib/"],
    [/from ['"]\.\.\/lib\//g, "from '@/lib/"],
    [/from ['"]\.\.\/\.\.\/\.\.\/components\//g, "from '@/components/"],
    [/from ['"]\.\.\/\.\.\/components\//g, "from '@/components/"],
    [/from ['"]\.\.\/components\//g, "from '@/components/"],
    [/from ['"]\.\.\/\.\.\/\.\.\/store\//g, "from '@/store/"],
    [/from ['"]\.\.\/\.\.\/store\//g, "from '@/store/"],
    [/from ['"]\.\.\/store\//g, "from '@/store/"],
    [/from ['"]\.\.\/\.\.\/context\//g, "from '@/context/"],
    [/from ['"]\.\.\/context\//g, "from '@/context/"],
    [/from ['"]\.\.\/\.\.\/\.\.\/data\//g, "from '@/data/"],
    [/from ['"]\.\.\/\.\.\/data\//g, "from '@/data/"],
    [/from ['"]\.\.\/data\//g, "from '@/data/"],
  ];
  for (const [pattern, replacement] of rules) {
    content = content.replace(pattern, replacement);
  }
  if (content !== original) fs.writeFileSync(file, content);
}

walk(root);
console.log('done');
