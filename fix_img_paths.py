import os
import re
from pathlib import Path

# Get the current directory
games_dir = Path('./games')

# Regular expression to find the entire related games section
section_pattern = re.compile(r'<div class="related-games">\s*<h3>Similar Games You\'ll Love</h3>\s*<div class="related-games-list">(.*?)</div>\s*</div>', re.DOTALL)

# Regular expression to find image sources
img_pattern = re.compile(r'<img src="([^"]+)" alt="([^"]+)">')

# Counter for fixed files
fixed_files = []

# Process each game file
for game_file in games_dir.glob('*.html'):
    with open(game_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the related games section
    section_match = section_pattern.search(content)
    if not section_match:
        continue
    
    section = section_match.group(1)
    modified_section = section
    
    # Find all image tags in the section
    needs_fixing = False
    for match in img_pattern.finditer(section):
        img_src = match.group(1)
        if "thumb" in img_src:
            # Replace "-thumb" with empty string in the image path
            new_img_src = img_src.replace("-thumb", "")
            modified_section = modified_section.replace(img_src, new_img_src)
            needs_fixing = True
    
    # If we made changes, update the content
    if needs_fixing:
        updated_content = content.replace(section_match.group(1), modified_section)
        
        with open(game_file, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        fixed_files.append(game_file.name)

# Print results
if fixed_files:
    print(f"Fixed image paths in {len(fixed_files)} files:")
    for file in fixed_files:
        print(f"  - {file}")
else:
    print("No files needed fixing.") 