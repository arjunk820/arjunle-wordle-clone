import requests
from bs4 import BeautifulSoup

# Set your target URL here
url = "https://scrabble.collinsdictionary.com/word-lists/four-letter-words-in-scrabble/"

# Fetch the page content
response = requests.get(url)
response.raise_for_status()  # Ensure the request was successful

# Parse the HTML using BeautifulSoup
soup = BeautifulSoup(response.text, 'html.parser')

# Extract words from the page.
# For example, if words are contained in <li> tags:
words = [li.get_text().strip() for li in soup.find_all('li')]

# Optionally, filter out any empty strings or duplicates
words = [word for word in words if word]

# Write the words to newWords.js in the required format
with open("newWords.js", "w") as f:
    f.write("export const WORDS = [\n")
    for word in words:
        f.write(f"    '{word}',\n")
    f.write("];\n")

print("Words have been successfully written to newWords.js")
