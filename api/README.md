# Hangman Word Generator API

Python Lambda function that generates random words for hangman games using NLTK's WordNet corpus with profanity and distressing content filtering.

## Features

- Generates random words from WordNet corpus
- Filters profanity and offensive content
- Removes distressing terms (violence, medical, etc.)
- Configurable word length
- Returns word definitions
- Serverless deployment via AWS Lambda

## Local Development

### Prerequisites

- Python 3.11+
- uv (Python package manager)

### Setup

1. **Install dependencies:**
```bash
cd api
uv sync
```

2. **Download NLTK data:**
```bash
uv run python download_nltk_data.py
```

This will download WordNet corpus to `lambda/nltk_data/` directory.

3. **Run tests:**
```bash
uv run pytest
```

4. **Start local development server:**
```bash
PYTHONPATH="./lambda:$PYTHONPATH" uv run python local_server.py
```

Then visit **http://localhost:8000** for interactive API documentation (Swagger UI).

### Project Structure

```
api/
├── lambda/
│   ├── handler.py          # Lambda function handler
│   ├── pyproject.toml      # Lambda dependencies
│   └── nltk_data/          # NLTK corpus data (downloaded, not in git)
├── tests/
│   ├── test_handler.py     # Test suite
│   └── conftest.py         # pytest configuration
├── download_nltk_data.py   # Script to download NLTK corpus
├── local_server.py         # Local dev server with Swagger UI
├── openapi.yaml            # OpenAPI specification
├── pyproject.toml          # Development dependencies (uv)
└── README.md
```

## API Usage

### Endpoint

```
GET /word
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `length` | integer | 5 | Exact word length (minimum: 3) |

### Example Request

```bash
curl "https://your-api.execute-api.region.amazonaws.com/word?length=8"
```

### Example Response

```json
{
  "word": "ELEPHANT",
  "length": 8,
  "definition": "five-toed pachyderm",
  "attempts": 3
}
```

### Error Responses

**400 Bad Request** - Invalid parameters:
```json
{
  "error": "length must be at least 3"
}
```

**500 Internal Server Error** - Word generation failed:
```json
{
  "error": "Failed to generate word",
  "message": "Could not find a valid word after 1000 attempts"
}
```

## Content Filtering

The API filters out:

1. **Profanity**: Uses better-profanity library to filter offensive words
2. **Distressing Terms**: Filters words related to:
   - Violence (murder, torture, etc.)
   - Death and dying
   - Medical conditions (cancer, disease, etc.)
   - Body fluids and waste
   - Deformities and injuries

3. **Distressing Domains**: Filters words from:
   - Medicine, pathology, surgery
   - Military and warfare
   - Slang and vulgar language
   - Offensive content

4. **Invalid Characters**: Removes words with underscores or hyphens

## Deployment

**Important:** The NLTK corpus must be downloaded as part of the build process:

```bash
uv run python download_nltk_data.py
```

This downloads the WordNet corpus to `lambda/nltk_data/` which is then included in the Lambda deployment package.

## Testing

### Run all tests:
```bash
uv run pytest
```

### Test individual functions:
```python
from lambda.handler import get_random_word, is_word_valid

# Test word generation
result = get_random_word(length=8)
print(result)

# Test word validation
is_valid, reason = is_word_valid("elephant", 8)
print(f"Valid: {is_valid}, Reason: {reason}")
```

## Development Notes

- NLTK data is pre-downloaded to avoid cold start delays in Lambda
- The function attempts up to 1000 times to find a valid word
- Filter statistics are logged for debugging
- CORS is enabled for frontend integration

## License

MIT
