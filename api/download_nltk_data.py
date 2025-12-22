"""
Download NLTK data for local development and Lambda deployment
This script should be run before testing locally or deploying to Lambda
"""
import nltk
import os

# Create nltk_data directory if it doesn't exist
nltk_data_dir = os.path.join(os.path.dirname(__file__), 'lambda', 'nltk_data')
os.makedirs(nltk_data_dir, exist_ok=True)

# Add to NLTK data path
nltk.data.path.insert(0, nltk_data_dir)

print(f"Downloading NLTK data to: {nltk_data_dir}")

# Download WordNet corpus
print("Downloading WordNet corpus...")
nltk.download('wordnet', download_dir=nltk_data_dir)

print("Downloading OMW (Open Multilingual WordNet)...")
nltk.download('omw-1.4', download_dir=nltk_data_dir)

print("\n✅ NLTK data download complete!")
print(f"Data location: {nltk_data_dir}")
print(f"\nYou can now run local tests or deploy to Lambda.")
