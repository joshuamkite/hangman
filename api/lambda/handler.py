"""
Hangman Word Generator Lambda Handler
Generates random words using NLTK with profanity and distressing content filtering
"""
import json
import random
import logging
from typing import Optional, Dict, Any, List
from nltk.corpus import wordnet as wn
from better_profanity import profanity
import nltk.data
import os

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize NLTK
nltk.data.path.append(os.path.join(os.getcwd(), 'nltk_data'))
wn.ensure_loaded()

# Distressing content filters (from wordsearch project)
DISTRESSING_TERMS = [
    'malformed', 'fetus', 'foetus', 'corpse', 'cadaver', 'death', 'dead', 'dying',
    'tumor', 'tumour', 'cancer', 'disease', 'deformity', 'deformed', 'murder',
    'suicide', 'killing', 'slaughter', 'torture', 'rape', 'abuse', 'violent',
    'blood', 'bleeding', 'wound', 'injury', 'mutilate', 'dismember', 'excrement',
    'feces', 'faeces', 'urine', 'vomit', 'pus', 'infection', 'infected'
]

DISTRESSING_DOMAINS = [
    '(medicine)', '(pathology)', '(surgery)', '(anatomy)', '(psychiatry)',
    '(military)', '(warfare)', '(slang)', '(vulgar)', '(offensive)'
]


def get_synset_for_word(word: str) -> Optional[Any]:
    """Get the best WordNet synset for a word, preferring noun definitions.

    WordNet organizes words into synsets (synonym sets). This function retrieves
    the most appropriate synset for a word, prioritizing noun definitions as they
    typically provide clearer, more concrete definitions for hangman games.

    Args:
        word: The word to find a synset for (case-insensitive)

    Returns:
        The best matching NLTK synset object, or None if no synset exists

    Example:
        >>> synset = get_synset_for_word("elephant")
        >>> synset.definition()
        'five-toed pachyderm'
    """
    word_synsets = wn.synsets(word.lower())
    if not word_synsets:
        return None

    # Prefer noun synsets for better definitions
    for synset in word_synsets:
        if synset.pos() == 'n':
            return synset

    # Fallback to first synset
    return word_synsets[0]


def is_word_valid(word: str, length: int) -> tuple[bool, Optional[str]]:
    """Validate a word against all content and quality filters.

    This function performs comprehensive validation including:
    - Length verification (exact match)
    - Character validation (no underscores or hyphens)
    - Profanity filtering (word and definition)
    - Offensive content filtering
    - Distressing content filtering (violence, medical, etc.)
    - Domain filtering (slang, vulgar, medical, military, etc.)

    Args:
        word: The word to validate (will be checked as lowercase)
        length: Required exact length for the word

    Returns:
        A tuple of (is_valid, reason). If valid, reason is None.
        If invalid, reason is one of:
        - 'incorrect_length': Word length doesn't match required length
        - 'invalid_characters': Contains underscore or hyphen
        - 'profanity_word': Word itself contains profanity
        - 'no_definition': No WordNet definition found
        - 'profanity_definition': Definition contains profanity
        - 'offensive_content': Definition marked as offensive
        - 'distressing_content': Definition contains distressing terms
        - 'distressing_domain': Word belongs to filtered domain

    Example:
        >>> is_valid, reason = is_word_valid("elephant", 8)
        >>> print(is_valid, reason)
        True None

        >>> is_valid, reason = is_word_valid("cat", 8)
        >>> print(is_valid, reason)
        False incorrect_length
    """
    # Length check
    if len(word) != length:
        return False, 'incorrect_length'

    # Character check - no underscores or hyphens
    if "_" in word or "-" in word:
        return False, 'invalid_characters'

    # Profanity check on word
    if profanity.contains_profanity(word):
        return False, 'profanity_word'

    # Get synset for definition check
    synset = get_synset_for_word(word)
    if not synset:
        return False, 'no_definition'

    definition = synset.definition().lower()

    # Profanity check on definition
    if profanity.contains_profanity(definition):
        return False, 'profanity_definition'

    # Offensive check
    if 'offensive' in definition:
        return False, 'offensive_content'

    # Distressing terms check
    if any(term in definition for term in DISTRESSING_TERMS):
        return False, 'distressing_content'

    # Distressing domains check
    if any(domain in definition for domain in DISTRESSING_DOMAINS):
        return False, 'distressing_domain'

    return True, None


def get_random_word(length: int = 5, max_attempts: int = 1000) -> Dict[str, Any]:
    """Generate a random word that passes all content and quality filters.

    Randomly selects words from the WordNet corpus and validates them against
    all filters. Continues attempting until a valid word is found or max_attempts
    is reached. Logs detailed statistics about filter rejections for debugging.

    Args:
        length: Required exact length for the word (default: 5)
        max_attempts: Maximum number of random words to try (default: 1000)

    Returns:
        Dictionary containing:
        - word (str): The valid word in UPPERCASE
        - length (int): Length of the word
        - definitions (List[str]): All available definitions for the word
        - attempts (int): Number of random words tried before finding this one

    Raises:
        Exception: If no valid word is found after max_attempts tries

    Example:
        >>> result = get_random_word(length=8)
        >>> print(result)
        {
            'word': 'ELEPHANT',
            'length': 8,
            'definitions': ['five-toed pachyderm', 'large mammal...'],
            'attempts': 3
        }
    """
    # Get all words from WordNet and pre-filter by length for efficiency
    all_words = [w for w in wn.words() if len(w) == length]

    if not all_words:
        raise Exception(f"No words of length {length} found in WordNet")

    logger.info(f"Found {len(all_words)} words of length {length} in WordNet")

    # Filter statistics
    filter_stats = {
        'attempts': 0,
        'incorrect_length': 0,
        'invalid_characters': 0,
        'profanity_word': 0,
        'no_definition': 0,
        'profanity_definition': 0,
        'offensive_content': 0,
        'distressing_content': 0,
        'distressing_domain': 0
    }

    for attempt in range(max_attempts):
        filter_stats['attempts'] += 1
        word = random.choice(all_words).lower()

        is_valid, reason = is_word_valid(word, length)

        if is_valid:
            # Get all definitions for the word
            all_synsets = wn.synsets(word.lower())
            definitions = [s.definition() for s in all_synsets if s.definition()]
            # Remove duplicates while preserving order
            seen = set()
            unique_definitions = []
            for d in definitions:
                if d not in seen:
                    seen.add(d)
                    unique_definitions.append(d)

            logger.info(f"Found valid word '{word}' after {attempt + 1} attempts")
            logger.info(f"Found {len(unique_definitions)} unique definitions")
            logger.info(f"Filter statistics: {filter_stats}")

            return {
                'word': word.upper(),
                'length': len(word),
                'definitions': unique_definitions,
                'attempts': attempt + 1
            }
        else:
            if reason:
                filter_stats[reason] = filter_stats.get(reason, 0) + 1

    logger.error(f"Failed to find valid word after {max_attempts} attempts")
    logger.error(f"Filter statistics: {filter_stats}")
    raise Exception(f"Could not find a valid word after {max_attempts} attempts")


def lambda_handler(event, context):
    """AWS Lambda handler function for the Hangman Word Generator API.

    This is the main entry point for the Lambda function. It processes API Gateway
    events, validates parameters, generates filtered words, and returns properly
    formatted HTTP responses with CORS headers.

    Args:
        event: AWS Lambda event object containing:
            - queryStringParameters: Dict with optional 'length' parameter
        context: AWS Lambda context object (unused but required by Lambda)

    Returns:
        Dictionary with HTTP response format:
        - statusCode (int): HTTP status code (200, 400, or 500)
        - headers (dict): Response headers including CORS
        - body (str): JSON string with result or error

    Response Formats:
        Success (200):
            {
                "word": "ELEPHANT",
                "length": 8,
                "definition": "five-toed pachyderm",
                "attempts": 3
            }

        Bad Request (400):
            {
                "error": "length must be at least 3"
            }

        Server Error (500):
            {
                "error": "Failed to generate word",
                "message": "Could not find a valid word after 1000 attempts"
            }

    Query Parameters:
        length (int, optional): Exact word length (minimum: 3, default: 5)

    Example:
        >>> event = {'queryStringParameters': {'length': '8'}}
        >>> response = lambda_handler(event, None)
        >>> response['statusCode']
        200
    """
    try:
        # Parse query parameters
        params = event.get('queryStringParameters') or {}
        length = int(params.get('length', 5))

        # Validate parameters
        if length < 3:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'length must be at least 3'
                })
            }

        logger.info(f"Generating word with length={length}")

        # Generate word
        result = get_random_word(length)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result)
        }

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'Invalid parameter: {str(e)}'
            })
        }

    except Exception as e:
        logger.error(f"Error generating word: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Failed to generate word',
                'message': str(e)
            })
        }
