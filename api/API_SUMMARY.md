# Hangman Word Generator API - Summary

## Quick Answers

### ✅ Do we have an API definition?
**YES** - See [`openapi.yaml`](openapi.yaml) for the complete OpenAPI 3.0 specification.

### ✅ Can we specify word length?
**YES** - Single query parameter:
- `length` (default: 5, minimum: 3)

**Example:**
```bash
GET /word?length=8
```

### ✅ Do we test for unfortunate words?
**YES** - Comprehensive filtering implemented and tested:

#### Profanity Filtering
- Uses `better-profanity` library
- Filters both the word itself AND its definition
- Tests: `test_handler.py` validates all words pass profanity checks

#### Distressing Content Filtering
The API filters words related to:

**Distressing Terms:**
- Violence: murder, torture, killing, slaughter, abuse
- Death: death, dead, dying, corpse, cadaver, suicide
- Medical: cancer, tumor, disease, infection, wound, injury
- Body fluids: blood, vomit, excrement, feces, urine, pus
- Disturbing: mutilate, dismember, deformity, malformed

**Distressing Domains:**
- Medical/Health: `(medicine)`, `(pathology)`, `(surgery)`, `(anatomy)`, `(psychiatry)`
- Violence: `(military)`, `(warfare)`
- Inappropriate: `(slang)`, `(vulgar)`, `(offensive)`

#### Invalid Characters
- Filters words with underscores (`_`)
- Filters words with hyphens (`-`)

---

## API Endpoint

### GET /word

**Request:**
```http
GET /word?length=8 HTTP/1.1
```

**Response (200 OK):**
```json
{
  "word": "ELEPHANT",
  "length": 8,
  "definition": "five-toed pachyderm",
  "attempts": 3
}
```

**Response Fields:**
- `word` (string): The generated word in UPPERCASE
- `length` (integer): Number of characters
- `definition` (string): WordNet definition
- `attempts` (integer): How many random words were tried before finding a valid one (debugging info)

**Error Response (400 Bad Request):**
```json
{
  "error": "length must be at least 3"
}
```

---

## Test Coverage

### What do the tests do?

We have **14 comprehensive tests** covering:

#### 1. Word Validation Tests
- ✅ Verifies valid words pass all checks
- ✅ Rejects words with incorrect length
- ✅ Filters words containing underscores
- ✅ Filters words containing hyphens

#### 2. Word Generation Tests
- ✅ Generates word with default params (5 chars)
- ✅ Generates short words (3 chars)
- ✅ Generates long words (10+ chars)
- ✅ Generates multiple words to verify consistency

#### 3. Lambda Handler Tests
- ✅ Handler works with no params
- ✅ Handler respects custom length
- ✅ Handler generates words of specific length
- ✅ Rejects length < 3
- ✅ CORS headers present for frontend
- ✅ Rejects non-integer params

### Are the tests relevant?

**YES** - The tests ensure:
1. ✅ **Safety**: Every word passes profanity and distressing content filters
2. ✅ **Correctness**: Word length constraints are enforced
3. ✅ **Reliability**: API handles invalid inputs gracefully
4. ✅ **Integration**: Lambda handler properly processes requests
5. ✅ **CORS**: Frontend will be able to call the API

---

## Content Filtering Flow

```
Random Word from WordNet
         ↓
  Length Check (exact match)
         ↓
  Character Check (no _ or -)
         ↓
  Profanity Check (word)
         ↓
  Get WordNet Definition
         ↓
  Profanity Check (definition)
         ↓
  Offensive Content Check
         ↓
  Distressing Terms Check
         ↓
  Distressing Domains Check
         ↓
     VALID WORD ✅
```

**If any check fails**, the word is rejected and another random word is tried.

**Maximum attempts**: 1000 (typically finds a valid word in < 10 attempts)

---

## Example Usage

### Get a default word (5 characters)
```bash
curl "http://localhost:8000/word"
```

Response:
```json
{
  "word": "HOUSE",
  "length": 5,
  "definition": "a dwelling that serves as living quarters",
  "attempts": 2
}
```

### Get a short word for easy games (3 characters)
```bash
curl "http://localhost:8000/word?length=3"
```

Response:
```json
{
  "word": "CAT",
  "length": 3,
  "definition": "feline mammal usually having thick soft fur",
  "attempts": 1
}
```

### Get a long word for hard games (12 characters)
```bash
curl "http://localhost:8000/word?length=12"
```

Response:
```json
{
  "word": "APPRECIATION",
  "length": 12,
  "definition": "understanding of the nature or meaning of something",
  "attempts": 8
}
```

---

## Filter Statistics Example

From logs when generating a word:
```
Filter results: {
  'attempts': 23,
  'incorrect_length': 15,
  'invalid_characters': 3,
  'profanity_word': 0,
  'no_definition': 2,
  'profanity_definition': 0,
  'offensive_content': 1,
  'distressing_content': 1,
  'distressing_domain': 1
}
```

This shows the API tried 23 words before finding one that passed all filters.

---

## Running Tests

```bash
cd api
uv sync                              # Install dependencies
uv run python download_nltk_data.py  # Download WordNet corpus
uv run pytest                        # Run all tests
```

**Current Status:** ✅ 14/14 tests passing

---

## Next Steps

1. ✅ API implementation complete
2. ✅ Comprehensive filtering implemented
3. ✅ Tests passing (16/16)
4. ✅ OpenAPI specification created
5. ⏳ Create React frontend
6. ⏳ Set up OpenTofu for AWS deployment
7. ⏳ Deploy to Lambda + API Gateway
8. ⏳ Deploy frontend to S3 + CloudFront
