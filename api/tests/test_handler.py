"""
Pytest tests for the hangman word generator Lambda function
"""
from handler import lambda_handler, get_random_word, is_word_valid
import sys
import os
import json
import pytest

# Add lambda directory to path
lambda_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'lambda')
sys.path.insert(0, lambda_dir)


class TestWordValidation:
    """Tests for word validation logic"""

    def test_valid_word(self):
        """Test that a valid word passes all checks"""
        is_valid, reason = is_word_valid("elephant", 8)
        assert is_valid is True
        assert reason is None

    def test_word_incorrect_length(self):
        """Test that a word with incorrect length is rejected"""
        is_valid, reason = is_word_valid("cat", 5)
        assert is_valid is False
        assert reason == 'incorrect_length'

    def test_word_with_underscore(self):
        """Test that words with underscores are rejected"""
        is_valid, reason = is_word_valid("test_word", 9)
        assert is_valid is False
        assert reason == 'invalid_characters'

    def test_word_with_hyphen(self):
        """Test that words with hyphens are rejected"""
        is_valid, reason = is_word_valid("test-word", 9)
        assert is_valid is False
        assert reason == 'invalid_characters'


class TestWordGeneration:
    """Tests for random word generation"""

    def test_generate_default_word(self):
        """Test generating a word with default parameters"""
        result = get_random_word(length=5)

        assert 'word' in result
        assert 'length' in result
        assert 'definition' in result
        assert 'attempts' in result

        assert len(result['word']) == 5
        assert result['word'].isupper()
        assert result['length'] == len(result['word'])

    def test_generate_short_word(self):
        """Test generating a short word"""
        result = get_random_word(length=3)

        assert len(result['word']) == 3

    def test_generate_long_word(self):
        """Test generating a long word"""
        result = get_random_word(length=12)

        assert len(result['word']) == 12

    def test_generate_multiple_words(self):
        """Test generating multiple words to ensure filtering works"""
        words = []
        for _ in range(10):
            result = get_random_word(length=7)
            words.append(result['word'])

        # All words should be 7 characters
        assert len(words) == 10
        for word in words:
            assert len(word) == 7


class TestLambdaHandler:
    """Tests for the Lambda handler function"""

    def test_handler_default_params(self):
        """Test handler with default parameters"""
        event = {'queryStringParameters': None}
        response = lambda_handler(event, None)

        assert response['statusCode'] == 200
        assert 'Access-Control-Allow-Origin' in response['headers']

        body = json.loads(response['body'])
        assert 'word' in body
        assert 'length' in body
        assert 'definition' in body
        assert body['length'] == 5  # default

    def test_handler_custom_length(self):
        """Test handler with custom word length"""
        event = {
            'queryStringParameters': {
                'length': '8'
            }
        }
        response = lambda_handler(event, None)

        assert response['statusCode'] == 200
        body = json.loads(response['body'])
        assert body['length'] == 8

    def test_handler_short_word(self):
        """Test handler with short word"""
        event = {
            'queryStringParameters': {
                'length': '3'
            }
        }
        response = lambda_handler(event, None)

        assert response['statusCode'] == 200
        body = json.loads(response['body'])
        assert body['length'] == 3

    def test_handler_invalid_length(self):
        """Test handler with invalid length (too short)"""
        event = {
            'queryStringParameters': {
                'length': '2'
            }
        }
        response = lambda_handler(event, None)

        assert response['statusCode'] == 400
        body = json.loads(response['body'])
        assert 'error' in body

    def test_handler_cors_headers(self):
        """Test that CORS headers are present"""
        event = {'queryStringParameters': None}
        response = lambda_handler(event, None)

        assert 'Access-Control-Allow-Origin' in response['headers']
        assert response['headers']['Access-Control-Allow-Origin'] == '*'

    def test_handler_invalid_parameter_type(self):
        """Test handler with invalid parameter type"""
        event = {
            'queryStringParameters': {
                'length': 'abc'
            }
        }
        response = lambda_handler(event, None)

        assert response['statusCode'] == 400
        body = json.loads(response['body'])
        assert 'error' in body
