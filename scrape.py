import requests
from bs4 import BeautifulSoup

# Set your target URL here
url = "https://www.scrabble.org.au/words/fours.htm"

# Fetch the page content
response = requests.get(url)
response.raise_for_status()  # Ensure the request was successful

# Parse the HTML using BeautifulSoup
soup = BeautifulSoup(response.text, 'html.parser')

# Try to locate a <pre> tag where the words might be contained.
pre_tag = soup.find('pre')
if pre_tag:
    # Split the text on whitespace to get the words.
    words = pre_tag.get_text().split()
else:
    # Fallback: split the entire page text (adjust if necessary).
    words = soup.get_text().split()

# Filter out empty strings (if any) and convert words to lowercase.
words = [word.lower() for word in words if word]

# Write the words to newWords.js in the required format.
with open("newWords.js", "w") as f:
    f.write("export const WORDS = [\n")
    for word in words:
        f.write(f"    '{word}',\n")
    f.write("];\n")

print("Words have been successfully written to newWords.js")
