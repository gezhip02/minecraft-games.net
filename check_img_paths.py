import os
import re
from pathlib import Path

# Get the current directory
games_dir = Path('./games')

# Regular expression to find image sources in the "Similar Games You'll Love" section
img_pattern = re.compile(r'<div class="related-games">\s*<h3>Similar Games You\'ll Love</h3>.*?</div>\s*</div>', re.DOTALL)
thumb_pattern = re.compile(r'<img src="([^"]+)" alt="[^"]+">')

problematic_files = {}

# Process each game file
for game_file in games_dir.glob('*.html'):
    with open(game_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find the related games section
    section_match = img_pattern.search(content)
    if not section_match:
        continue
    
    section = section_match.group(0)
    
    # Find all image sources in the section
    img_sources = thumb_pattern.findall(section)
    
    # Check if any image source contains "thumb"
    problematic_images = []
    for img_src in img_sources:
        if "thumb" in img_src:
            problematic_images.append(img_src)
    
    if problematic_images:
        problematic_files[game_file.name] = problematic_images

# Print results
if problematic_files:
    print("Found image paths with 'thumb' in the following files:")
    for file, images in problematic_files.items():
        print(f"\n{file}:")
        for img in images:
            print(f"  - {img}")
    
    print(f"\n\nTotal files with problematic image paths: {len(problematic_files)}")
else:
    print("No image paths with 'thumb' found.") 