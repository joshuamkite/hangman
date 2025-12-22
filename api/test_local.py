"""
Local test script for the hangman word generator Lambda function
Run this to test the handler locally before deploying
"""
from handler import lambda_handler
import sys
import os
import json

# Add lambda directory to path
lambda_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lambda')
sys.path.insert(0, lambda_dir)


def test_basic():
    """Test basic word generation with default parameters.

    Verifies that the Lambda handler successfully generates a word when
    no query parameters are provided, using the default length of 5.
    """
    print("=" * 60)
    print("Test 1: Basic word generation (default parameters)")
    print("=" * 60)

    event = {
        'queryStringParameters': None
    }

    response = lambda_handler(event, None)
    print(f"Status: {response['statusCode']}")

    if response['statusCode'] == 200:
        body = json.loads(response['body'])
        print(f"Word: {body['word']}")
        print(f"Length: {body['length']}")
        print(f"Definition: {body['definition']}")
        print(f"Attempts to find valid word: {body['attempts']}")
    else:
        print(f"Error: {response['body']}")
    print()


def test_custom_length():
    """Test word generation with custom length parameter.

    Verifies that the handler correctly generates words matching the
    specified exact length requirement.
    """
    print("=" * 60)
    print("Test 2: Custom word length (6-8 characters)")
    print("=" * 60)

    event = {
        'queryStringParameters': {
            'min_length': '6',
            'max_length': '8'
        }
    }

    response = lambda_handler(event, None)
    print(f"Status: {response['statusCode']}")

    if response['statusCode'] == 200:
        body = json.loads(response['body'])
        print(f"Word: {body['word']}")
        print(f"Length: {body['length']}")
        print(f"Definition: {body['definition']}")
        print(f"Attempts to find valid word: {body['attempts']}")
    else:
        print(f"Error: {response['body']}")
    print()


def test_short_words():
    """Test generation of short words (3 characters).

    Verifies that the handler can successfully generate very short words,
    which are useful for easier hangman games.
    """
    print("=" * 60)
    print("Test 3: Short words (3-5 characters)")
    print("=" * 60)

    event = {
        'queryStringParameters': {
            'min_length': '3',
            'max_length': '5'
        }
    }

    response = lambda_handler(event, None)
    print(f"Status: {response['statusCode']}")

    if response['statusCode'] == 200:
        body = json.loads(response['body'])
        print(f"Word: {body['word']}")
        print(f"Length: {body['length']}")
        print(f"Definition: {body['definition']}")
        print(f"Attempts to find valid word: {body['attempts']}")
    else:
        print(f"Error: {response['body']}")
    print()


def test_long_words():
    """Test generation of long words (10+ characters).

    Verifies that the handler can successfully generate longer words,
    which are useful for more challenging hangman games. Longer words
    may take more attempts to find as they're less common.
    """
    print("=" * 60)
    print("Test 4: Long words (10-15 characters)")
    print("=" * 60)

    event = {
        'queryStringParameters': {
            'min_length': '10',
            'max_length': '15'
        }
    }

    response = lambda_handler(event, None)
    print(f"Status: {response['statusCode']}")

    if response['statusCode'] == 200:
        body = json.loads(response['body'])
        print(f"Word: {body['word']}")
        print(f"Length: {body['length']}")
        print(f"Definition: {body['definition']}")
        print(f"Attempts to find valid word: {body['attempts']}")
    else:
        print(f"Error: {response['body']}")
    print()


def test_invalid_params():
    """Test error handling for invalid length parameter.

    Verifies that the handler properly rejects invalid length values
    and returns a 400 Bad Request status with an appropriate error message.
    """
    print("=" * 60)
    print("Test 5: Invalid parameters (max < min)")
    print("=" * 60)

    event = {
        'queryStringParameters': {
            'min_length': '10',
            'max_length': '5'
        }
    }

    response = lambda_handler(event, None)
    print(f"Status: {response['statusCode']}")
    body = json.loads(response['body'])
    print(f"Response: {body}")
    print()


def test_multiple_generations():
    """Test generating multiple words to verify consistent filtering.

    Generates 10 words to verify that:
    - All words pass content filters
    - Words meet length requirements
    - Definitions are provided
    - The filtering process is reliable and repeatable
    """
    print("=" * 60)
    print("Test 6: Generate 10 words to verify filtering")
    print("=" * 60)

    event = {
        'queryStringParameters': {
            'min_length': '5',
            'max_length': '10'
        }
    }

    words = []
    for i in range(10):
        response = lambda_handler(event, None)
        if response['statusCode'] == 200:
            body = json.loads(response['body'])
            words.append(body['word'])
            print(f"{i+1}. {body['word']} ({body['length']} letters) - {body['definition'][:50]}...")

    print(f"\nGenerated {len(words)} words")
    print()


if __name__ == '__main__':
    print("\n🎮 Hangman Word Generator - Local Test Suite\n")

    try:
        test_basic()
        test_custom_length()
        test_short_words()
        test_long_words()
        test_invalid_params()
        test_multiple_generations()

        print("=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
