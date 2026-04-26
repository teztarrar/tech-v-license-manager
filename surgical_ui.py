import re

with open('src/components/ui/index.tsx', 'rb') as f:
    text = f.read().decode('utf-8')

# Replace motion.button -> button, add btn-press
old_button = '''    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >'''

new_button = '''    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} btn-press ${variants[variant]} ${sizes[size]} ${className}`}
    >'''

text = text.replace(old_button, new_button)

# Also close tag
text = text.replace('    </motion.button>', '    </button>')

with open('src/components/ui/index.tsx', 'wb') as f:
    f.write(text.encode('utf-8'))
print('ui/index.tsx surgically edited')
