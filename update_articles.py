import os
import re
import random
from pathlib import Path

# The four articles to be used for related articles
related_articles = [
    {
        "file": "exploring-minecraft-new-update.html",
        "title": "Exploring Minecraft's New Update",
        "image": "../images/articles/exploring-minecraft-new-update-small.jpg",
        "read_time": "6 min read"
    },
    {
        "file": "minecraft-movie-adventure-big-screen.html",
        "title": "Minecraft Movie Adventure on the Big Screen",
        "image": "../images/articles/minecraft-movie-adventure-big-screen-small.jpg",
        "read_time": "8 min read"
    },
    {
        "file": "minecraft-top-10-building-techniques.html",
        "title": "Top 10 Building Techniques in Minecraft",
        "image": "../images/articles/minecraft-top-10-building-techniques.jpg",
        "read_time": "10 min read"
    },
    {
        "file": "resource-collection-strategy-guide.html",
        "title": "Resource Collection Strategy Guide",
        "image": "../images/articles/resource-collection-strategy-guide.jpg",
        "read_time": "15 min read"
    }
]

# Directory containing game HTML files
games_dir = Path("games")

# Regular expression to match the Related Article section
related_article_pattern = re.compile(
    r'<div class="featured-article">\s*'
    r'<h3>Related Article</h3>\s*'
    r'<a href=".+?" class="featured-article-card">[\s\S]+?</a>\s*'
    r'</div>'
)

def create_related_article_html(article):
    return f'''<div class="featured-article">
                        <h3>Related Article</h3>
                        <a href="../articles/{article["file"]}" class="featured-article-card">
                            <img src="{article["image"]}" alt="{article["title"]}">
                            <div class="featured-article-info">
                                <h4>{article["title"]}</h4>
                                <span><i class="far fa-clock"></i> {article["read_time"]}</span>
                            </div>
                        </a>
                    </div>'''

# Process each game HTML file
files_updated = 0
for game_file in games_dir.glob("*.html"):
    try:
        # Read the current content
        try:
            with open(game_file, "r", encoding="utf-8") as f:
                content = f.read()
        except UnicodeDecodeError:
            # Try with a different encoding if UTF-8 fails
            with open(game_file, "r", encoding="latin-1") as f:
                content = f.read()
        
        # Select a random article from the specified list
        selected_article = random.choice(related_articles)
        
        # Create the new featured article HTML
        new_article_html = create_related_article_html(selected_article)
        
        # Replace the existing featured article section
        if related_article_pattern.search(content):
            updated_content = related_article_pattern.sub(new_article_html, content)
            
            # Write the updated content back to the file
            with open(game_file, "w", encoding="utf-8") as f:
                f.write(updated_content)
            
            print(f"Updated: {game_file} with {selected_article['file']}")
            files_updated += 1
        else:
            print(f"Warning: Related article section not found in {game_file}")
    
    except Exception as e:
        print(f"Error processing {game_file}: {e}")

print(f"\nCompleted: Updated {files_updated} game files with the specified related articles.")
