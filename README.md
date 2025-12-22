# Hangman Game

A full-stack hangman game with a React TypeScript frontend and Python Lambda backend, designed for deployment to AWS (CloudFront/S3 + API Gateway/Lambda).

## Project Structure

```
hangman/
├── api/                    # Backend API (Python/Lambda)
│   ├── lambda/            # Lambda function code
│   ├── tests/             # API tests
│   ├── handler.py         # Main Lambda handler
│   ├── local_server.py    # Local development server
│   ├── openapi.yaml       # API specification
│   └── README.md          # API documentation
│
└── frontend/              # Frontend app (React/TypeScript)
    ├── src/
    │   ├── components/    # React components
    │   ├── api.ts         # API client
    │   ├── types.ts       # TypeScript types
    │   └── App.tsx        # Main app component
    ├── .env.example       # Environment template
    └── README.md          # Frontend documentation
```

## Features

- **Multiple Figure Types**: Choose between classic hangman person or spider
- **Difficulty Levels**: Easy (10 guesses) or Hard (6 guesses)
- **Customizable Word Length**: Select words from 3 to 15 letters
- **Keyboard Support**: Use physical keyboard or on-screen buttons
- **Word Definitions**: View WordNet definitions from the API
- **Content Filtering**: Backend filters profanity and distressing content
- **Responsive Design**: Works on desktop and mobile

## Quick Start

### Option 1: Run Everything at Once (Recommended)

```bash
./run-local.sh
```

This script will:
- Install all dependencies (if needed)
- Start the API server on http://localhost:8000
- Start the frontend dev server on http://localhost:5173
- Both servers will run together, press Ctrl+C to stop both

### Option 2: Run Separately

**Terminal 1 - Start the Backend API:**
```bash
cd api
uv sync
uv run python download_nltk_data.py
uv run python local_server.py
```

**Terminal 2 - Start the Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Then open http://localhost:5173 in your browser.

See [`api/README.md`](api/README.md) and [`frontend/README.md`](frontend/README.md) for detailed setup.

## API Endpoint

**GET** `/word?length={number}`

Returns a random word with the specified length, along with its definition.

**Example Response:**
```json
{
  "word": "ELEPHANT",
  "length": 8,
  "definition": "five-toed pachyderm",
  "attempts": 3
}
```

See [`api/openapi.yaml`](api/openapi.yaml) for the full API specification.

## Game Rules

1. Select your preferences (figure type, difficulty, word length)
2. Click "New Game" to fetch a random word from the API
3. Guess letters using keyboard or on-screen buttons
4. Win by guessing all letters before running out of attempts
5. View the word definition when you win or lose

### Figure Parts

Both person and spider have the same number of parts to ensure fair gameplay:

- **Easy Mode**: 10 parts (10 wrong guesses allowed)
- **Hard Mode**: 6 parts (6 wrong guesses allowed)

## Technology Stack

### Backend
- Python 3.12+
- NLTK WordNet (word database)
- better-profanity (content filtering)
- FastAPI (local development)
- AWS Lambda (production)

### Frontend
- React 18
- TypeScript
- Vite (build tool)
- CSS3 (styling)

## Deployment

### Backend to AWS Lambda

1. Package the Lambda function with dependencies
2. Deploy to AWS Lambda
3. Configure API Gateway
4. Set up CORS for frontend access

See [`api/README.md`](api/README.md) for deployment details.

### Frontend to S3 + CloudFront

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Upload to S3:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

3. Configure CloudFront distribution

4. Update `.env` with production API URL

See [`frontend/README.md`](frontend/README.md) for deployment details.

## Development

### Running Tests

Backend tests:
```bash
cd api
uv run pytest
```

### Environment Variables

**Backend** (api/.env):
- None required for local development

**Frontend** (frontend/.env):
- `VITE_API_URL` - API endpoint URL (default: http://localhost:8000)

## Content Safety

The API implements comprehensive content filtering:

- **Profanity filtering** using better-profanity library
- **Distressing content filtering** (violence, medical, death-related terms)
- **Domain filtering** (slang, vulgar, offensive, medical, military)
- **Character validation** (no hyphens or underscores)

All words and definitions are safe for general audiences.

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues or questions:
- Check the README files in `api/` and `frontend/`
- Review the API specification in `api/openapi.yaml`
- See `api/API_SUMMARY.md` for API details
