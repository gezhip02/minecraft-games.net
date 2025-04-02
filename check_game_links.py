import os
import re
from pathlib import Path

# Get the current directory
games_dir = Path('./games')

# Get all actual game files
existing_games = set(f.name for f in games_dir.glob('*.html'))

# Regular expression to find links in the "Similar Games You'll Love" section
link_pattern = re.compile(r'<a href="([^"]+\.html)" class="related-game"')

broken_links = {}

# Process each game file
for game_file in games_dir.glob('*.html'):
    with open(game_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find all game links in the Similar Games section
    links = link_pattern.findall(content)
    
    # Check if each link exists
    file_broken_links = []
    for link in links:
        if link not in existing_games:
            file_broken_links.append(link)
    
    if file_broken_links:
        broken_links[game_file.name] = file_broken_links

# Print results
if broken_links:
    print("Found broken links in the following files:")
    for file, links in broken_links.items():
        print(f"\n{file}:")
        for link in links:
            print(f"  - {link}")
    
    print("\n\nSummary of all broken links:")
    all_broken = set()
    for links in broken_links.values():
        all_broken.update(links)
    
    for link in sorted(all_broken):
        count = sum(1 for links in broken_links.values() if link in links)
        print(f"{link}: referenced in {count} files")
else:
    print("No broken links found.") 