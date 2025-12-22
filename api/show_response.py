#!/usr/bin/env python3
"""Quick demonstration script to show actual API response format with definition.

This script generates a sample word using the handler function and displays
the complete JSON response structure, including the WordNet definition.
Useful for verifying the API output format during development.
"""
from handler import get_random_word
import sys
import os
import json

# Add lambda directory to path
lambda_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lambda')
sys.path.insert(0, lambda_dir)


def main():
    """Generate and display a sample word response.

    Generates an 8-letter word and displays:
    - The complete JSON response structure
    - Confirmation that definition is present
    - Length of the definition text
    """
    print("Generating word with length=8...\n")
    result = get_random_word(length=8)

    print(json.dumps(result, indent=2))
    print(f"\nDefinition present: {result['definition'] is not None}")
    print(f"Definition length: {len(result['definition']) if result['definition'] else 0} characters")


if __name__ == '__main__':
    main()
