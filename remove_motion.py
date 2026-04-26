import os

files = {
    'src/app/users/page.tsx': [
        ("import { motion } from 'framer-motion'\n", ''),
        ('<motion.tr key={u.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>', '<tr key={u.id}>'),
        ('</motion.tr>', '</tr>'),
    ],
    'src/app/products/page.tsx': [
        ("import { motion } from 'framer-motion'\n", ''),
        ('<motion.tr key={p.id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}>', '<tr key={p.id}>'),
        ('</motion.tr>', '</tr>'),
    ],
    'src/app/renewals/page.tsx': [
        ("import { motion } from 'framer-motion'\n", ''),
        ('<motion.tr key={lic.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}>', '<tr key={lic.id}>'),
        ('</motion.tr>', '</tr>'),
    ],
    'src/app/notifications/page.tsx': [
        ("import { motion } from 'framer-motion'\n", ''),
        ('<motion.div\n                key={n.id}\n                initial={{ opacity: 0, y: 8 }}\n                animate={{ opacity: 1, y: 0 }}\n                transition={{ delay: i * 0.03 }}', '<div key={n.id} className="slide-up"'),
        ('                onClick={() => !n.read && markRead(n.id)}', ' onClick={() => !n.read && markRead(n.id)}'),
        ('                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${', ' style={{\n                  borderBottom: \'1px solid var(--border-subtle)\',\n                  background: !n.read ? \'var(--bg-hover)\' : undefined,\n                }}\n                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${'),
        ('                ${!n.read ? \'opacity-100\' : \'opacity-60\'}', '${!n.read ? \'opacity-100\' : \'opacity-60\'}'),
        ('              >', '>'),
        ('</motion.div>', '</div>'),
    ],
    'src/app/companies/page.tsx': [
        ("import { motion } from 'framer-motion'\n", ''),
        ('<motion.div key={c.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}', '<div key={c.id} className="slide-up"'),
        ('</motion.div>', '</div>'),
    ],
    'src/app/reports/page.tsx': [
        ("import { motion } from 'framer-motion'\n", ''),
    ],
}

for path, replacements in files.items():
    if not os.path.exists(path):
        print(f'SKIP (not found): {path}')
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
        else:
            print(f'  WARN: pattern not found in {path}: {old[:60]}...')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {path}')
