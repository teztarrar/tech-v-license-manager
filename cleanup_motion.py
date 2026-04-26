import re
import os

def read_file(path):
    with open(path, 'rb') as f:
        return f.read().decode('utf-8', errors='replace')

def write_file(path, content):
    with open(path, 'wb') as f:
        f.write(content.encode('utf-8'))

# 1. Fix users/page.tsx - remove motion.div on stat cards
c = read_file('src/app/users/page.tsx')
c = c.replace("import { motion } from 'framer-motion'\n", '')
c = c.replace('<motion.div key={s.role} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}\n              ', '<div key={s.role} ')
c = c.replace('            </motion.div>', '            </div>')
write_file('src/app/users/page.tsx', c)
print('users/page.tsx cleaned')

# 2. Fix renewals/page.tsx - remove motion.div on stat cards
c = read_file('src/app/renewals/page.tsx')
# Replace the 3 motion.div stat cards with regular divs
c = c.replace('<motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="bg-yellow-500/10', '<div className="slide-up bg-yellow-500/10')
c = c.replace('<motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.05}} className="bg-red-500/10', '<div className="slide-up stagger-1 bg-red-500/10')
c = c.replace('<motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="bg-brand-500/10', '<div className="slide-up stagger-2 bg-brand-500/10')
# Fix closing tags (there should be 3)
for _ in range(3):
    c = c.replace('</motion.div>', '</div>', 1)
write_file('src/app/renewals/page.tsx', c)
print('renewals/page.tsx cleaned')

# 3. Check/fix settings/page.tsx - it's acceptable to keep AnimatePresence for tab transitions
# since it only renders 1 element at a time. But remove any heavy motion.
c = read_file('src/app/settings/page.tsx')
# Remove whileTap from tab buttons (already done, check again)
if 'whileTap' in c:
    c = c.replace('whileTap={{ scale: 0.97 }}', '')
    c = c.replace('              whileTap={{ scale: 0.97 }}', '')
write_file('src/app/settings/page.tsx', c)
print('settings/page.tsx checked')

# 4. Check licenses/page.tsx encoding and fix if needed
if os.path.exists('src/app/licenses/page.tsx'):
    with open('src/app/licenses/page.tsx', 'rb') as f:
        raw = f.read()
    try:
        c = raw.decode('utf-8')
        print('licenses/page.tsx: UTF-8 OK')
        has_motion = 'framer-motion' in c or '<motion.' in c
        print(f'  has motion: {has_motion}')
    except:
        # Try to fix encoding
        c = raw.decode('utf-8', errors='replace')
        # Remove replacement characters
        c = c.replace('\ufffd', '')
        write_file('src/app/licenses/page.tsx', c)
        print('licenses/page.tsx: encoding fixed')
else:
    print('licenses/page.tsx: NOT FOUND')

# 5. Verify no remaining motion imports in pages (except settings which keeps AnimatePresence)
for p in ['src/app/dashboard/page.tsx', 'src/app/login/page.tsx', 'src/app/reports/page.tsx',
          'src/app/companies/page.tsx', 'src/app/products/page.tsx', 'src/app/users/page.tsx',
          'src/app/renewals/page.tsx', 'src/app/notifications/page.tsx']:
    c = read_file(p)
    if 'framer-motion' in c:
        print(f'WARN: {p} still imports framer-motion')
    if '<motion.' in c:
        print(f'WARN: {p} still has motion tags')
