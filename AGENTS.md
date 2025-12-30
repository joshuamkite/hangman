# AI Agent Development Notes

## Project Overview

Hangman game with React TypeScript frontend and Python Lambda backend, deployed to AWS with OpenTofu/Terraform.

## Key Technologies

- **Backend**: Python 3.13, NLTK WordNet, better-profanity, AWS Lambda
- **Frontend**: React 18, TypeScript, Vite
- **Infrastructure**: OpenTofu/Terraform, API Gateway, S3, CloudFront
- **License**: AGPL-3.0

## Project Structure

```
hangman/
├── api/                    # Python backend
│   ├── lambda/            # Lambda function code
│   │   ├── handler.py     # Main handler with word generation
│   │   └── pyproject.toml # Lambda dependencies
│   ├── tests/             # Test suite
│   ├── local_server.py    # FastAPI dev server
│   └── openapi.yaml       # API specification
├── frontend/              # React TypeScript
│   └── src/
│       ├── components/    # React components
│       ├── api.ts         # API client
│       └── App.tsx        # Main game logic
└── terraform/             # AWS infrastructure
```

## Key Files for AI Development

### Backend
- [`api/lambda/handler.py`](api/lambda/handler.py) - Core word generation logic with content filtering
- [`api/tests/test_handler.py`](api/tests/test_handler.py) - Test suite
- [`api/openapi.yaml`](api/openapi.yaml) - API specification (ensure license field matches AGPL-3.0)

### Frontend
- [`frontend/src/App.tsx`](frontend/src/App.tsx) - Main game state and logic
- [`frontend/src/api.ts`](frontend/src/api.ts) - API client
- [`frontend/src/types.ts`](frontend/src/types.ts) - TypeScript type definitions
- [`frontend/src/components/`](frontend/src/components/) - React components

### Infrastructure
- [`terraform/`](terraform/) - All AWS infrastructure as code
- [`run-local.sh`](run-local.sh) - Local development script

## Development Guidelines

### Testing
```bash
# Backend tests
cd api && uv run pytest

# Local development
./run-local.sh  # Starts both backend (8000) and frontend (5173)
```

### Content Filtering
The API implements comprehensive filtering:
- Profanity (better-profanity library)
- Distressing terms (violence, death, medical)
- Distressing domains (military, warfare, vulgar, offensive)
- Invalid characters (underscores, hyphens)

See [`api/lambda/handler.py`](api/lambda/handler.py) for filter implementation.

### License Compliance
- Project is licensed under **AGPL-3.0**
- All new code must be compatible with AGPL-3.0
- Include AGPL reference in API documentation (OpenAPI spec)
- License text available in [`LICENSE`](LICENSE) and displayed in frontend via [`frontend/src/licenseText.ts`](frontend/src/licenseText.ts)

## Common Tasks

### Adding New Features
1. Update [`api/lambda/handler.py`](api/lambda/handler.py) for backend changes
2. Update [`api/openapi.yaml`](api/openapi.yaml) for API changes
3. Add tests to [`api/tests/test_handler.py`](api/tests/test_handler.py)
4. Update frontend components in [`frontend/src/`](frontend/src/)
5. Test locally with [`run-local.sh`](run-local.sh)

### Modifying Content Filters
- Edit `DISTRESSING_TERMS` or `DISTRESSING_DOMAINS` in [`api/lambda/handler.py`](api/lambda/handler.py)
- Update `is_word_valid()` function for new filter logic
- Add corresponding tests

### Infrastructure Changes
- Modify Terraform files in [`terraform/`](terraform/)
- Run `tofu plan` and `tofu apply` to deploy

## Important Notes

- NLTK data is pre-downloaded to avoid Lambda cold start delays
- Frontend environment variable: `VITE_API_URL`
- CORS is enabled for frontend integration
- All API responses include CORS headers

## Future Development Ideas

- Add multiplayer support
- Implement difficulty-based word selection (beyond just length)
- Add word categories/themes
- Include hint system
- Add statistics/leaderboard
- Support multiple languages
