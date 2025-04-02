import os
import re
import random
from pathlib import Path

# Get the current directory
games_dir = Path('./games')

# Get all actual game files
existing_games = [f.name for f in games_dir.glob('*.html')]

# Regular expression to find the entire related games section
section_pattern = re.compile(r'<div class="related-games">\s*<h3>Similar Games You\'ll Love</h3>\s*<div class="related-games-list">(.*?)</div>\s*</div>', re.DOTALL)

# Regular expression to find individual game links
link_pattern = re.compile(r'<a href="([^"]+\.html)" class="related-game">(.*?)</a>', re.DOTALL)

# Process each game file
fixed_files = []

for game_file in games_dir.glob('*.html'):
    with open(game_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the related games section
    section_match = section_pattern.search(content)
    if not section_match:
        continue
    
    section = section_match.group(1)
    
    # Find all game links
    links = link_pattern.findall(section)
    
    needs_fixing = False
    modified_section = section
    
    # Check each link
    for link_url, link_content in links:
        if link_url not in existing_games:
            # Pick a random existing game (excluding the current one)
            available_games = [game for game in existing_games if game != game_file.name]
            replacement = random.choice(available_games)
            
            # Get replacement game's name by removing .html and replacing hyphens with spaces
            replacement_name = replacement[:-5].replace('-', ' ').title()
            
            # Replace the link URL
            old_link = f'<a href="{link_url}" class="related-game">'
            new_link = f'<a href="{replacement}" class="related-game">'
            
            # Extract the image path and alt text
            img_pattern = re.compile(r'<img src="([^"]+)" alt="([^"]+)">')
            img_match = img_pattern.search(link_content)
            
            if img_match:
                old_img_src = img_match.group(1)
                old_img_alt = img_match.group(2)
                
                # Create new image path based on replacement game
                new_img_src = f"../images/games/{replacement[:-5]}-thumb.jpg"
                
                # Replace image
                modified_link_content = link_content.replace(old_img_src, new_img_src)
                modified_link_content = modified_link_content.replace(f'alt="{old_img_alt}"', f'alt="{replacement_name}"')
                
                # Replace span text
                span_pattern = re.compile(r'<span>(.*?)</span>')
                modified_link_content = span_pattern.sub(f'<span>{replacement_name}</span>', modified_link_content)
                
                # Replace the entire link in the section
                old_full_link = f'<a href="{link_url}" class="related-game">{link_content}</a>'
                new_full_link = f'<a href="{replacement}" class="related-game">{modified_link_content}</a>'
                
                modified_section = modified_section.replace(old_full_link, new_full_link)
                needs_fixing = True
            else:
                # Simpler replacement if we can't parse the image
                old_pattern = f'href="{link_url}"'
                new_pattern = f'href="{replacement}"'
                modified_section = modified_section.replace(old_pattern, new_pattern)
                needs_fixing = True
    
    # If we made changes, update the content
    if needs_fixing:
        updated_content = content.replace(section_match.group(1), modified_section)
        
        with open(game_file, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        fixed_files.append(game_file.name)

# Print results
if fixed_files:
    print(f"Fixed broken links in {len(fixed_files)} files:")
    for file in fixed_files:
        print(f"  - {file}")
else:
    print("No files needed fixing.") 