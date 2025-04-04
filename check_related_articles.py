import os
import re
from pathlib import Path

# The four required articles
required_articles = [
    "exploring-minecraft-new-update.html",
    "minecraft-movie-adventure-big-screen.html",
    "minecraft-top-10-building-techniques.html",
    "resource-collection-strategy-guide.html"
]

# Directory containing game HTML files
games_dir = Path("games")

# Regular expression to match the Related Article link
related_article_pattern = re.compile(r'<a href="\.\./articles/([^"]+)"')

# Track results
results = {
    "updated": [],
    "needs_update": [],
    "no_section_found": []
}

# Check each game HTML file
for game_file in games_dir.glob("*.html"):
    try:
        # Read the current content
        try:
            with open(game_file, "r", encoding="utf-8") as f:
                content = f.read()
        except UnicodeDecodeError:
            try:
                with open(game_file, "r", encoding="latin-1") as f:
                    content = f.read()
            except:
                print(f"Error: Could not read {game_file} with any encoding")
                continue
        
        # Find the Related Article section
        if '<h3>Related Article</h3>' in content:
            # Look for the article link
            match = related_article_pattern.search(content)
            if match:
                article_file = match.group(1)
                if article_file in required_articles:
                    results["updated"].append((game_file.name, article_file))
                else:
                    results["needs_update"].append((game_file.name, article_file))
            else:
                results["no_section_found"].append(game_file.name)
        else:
            results["no_section_found"].append(game_file.name)
    
    except Exception as e:
        print(f"Error processing {game_file}: {e}")

# Print results
print(f"\nSummary of Related Articles in Game Pages")
print(f"----------------------------------------")
print(f"Total game files checked: {len(list(games_dir.glob('*.html')))}")
print(f"Game files with correct articles: {len(results['updated'])}")
print(f"Game files needing updates: {len(results['needs_update'])}")
print(f"Game files with no Related Article section found: {len(results['no_section_found'])}")
print(f"\nDetails:")

print("\nGames with correct articles:")
for game, article in results["updated"]:
    print(f"  {game} -> {article}")

print("\nGames needing updates:")
for game, article in results["needs_update"]:
    print(f"  {game} -> {article} (needs to be changed to one of the required articles)")

if results["no_section_found"]:
    print("\nGames with no Related Article section found:")
    for game in results["no_section_found"]:
        print(f"  {game}")
