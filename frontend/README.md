# Hangman Game Frontend

A modern, interactive Hangman game built with React and TypeScript. Features multiple figure types (person/spider), difficulty levels, and dynamic word generation from a backend API.

## Features

- **Two Figure Types**: Choose between classic hangman person or spider
- **Difficulty Levels**:
  - Easy: 10 wrong guesses allowed
  - Hard: 6 wrong guesses allowed
- **Customizable Word Length**: Select words from 3 to 15 letters
- **Keyboard Support**: Use physical keyboard or on-screen buttons
- **Word Definitions**: View WordNet definitions when you win
- **Beautiful UI**: Modern gradient design with smooth animations
- **Responsive**: Works great on desktop and mobile devices

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Running hangman API (see `../api/README.md`)

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure API endpoint**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` to point to your API:
   ```
   VITE_API_URL=http://localhost:8000
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── GameSettings.tsx    # Game configuration controls
│   │   ├── Keyboard.tsx        # On-screen keyboard
│   │   ├── PersonFigure.tsx    # SVG person hangman
│   │   ├── SpiderFigure.tsx    # SVG spider hangman
│   │   └── WordDisplay.tsx     # Word with blanks/letters
│   ├── api.ts                  # API service layer
│   ├── types.ts                # TypeScript type definitions
│   ├── App.tsx                 # Main game component
│   ├── App.css                 # Application styles
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles
├── .env.example                # Environment variables template
├── vite.config.ts              # Vite configuration
└── package.json
```

## Game Rules

1. **Start Game**: Click "New Game" to get a random word
2. **Guess Letters**: Click on-screen buttons or use your keyboard
3. **Win Condition**: Guess all letters before running out of attempts
4. **Lose Condition**: Make too many wrong guesses (6 or 10 depending on difficulty)

### Figure Parts

Both person and spider have the same number of parts:

**Easy Mode (10 parts)**:
- Person: head, body, left arm, right arm, left leg, right leg, left hand, right hand, left foot, right foot
- Spider: body, head, 4 pairs of legs, eyes, silk thread

**Hard Mode (6 parts)**:
- Person: head, body, left arm, right arm, left leg, right leg
- Spider: body, head, 2 pairs of front legs, 2 pairs of middle legs

## Deployment to AWS

### Build for Production

```bash
npm run build
```

This creates optimized static files in the `dist/` directory.

### Deploy to S3 + CloudFront

1. **Create S3 bucket** (via AWS Console or Infrastructure as Code):
   ```bash
   aws s3 mb s3://your-hangman-bucket
   ```

2. **Configure bucket for static hosting**:
   ```bash
   aws s3 website s3://your-hangman-bucket --index-document index.html
   ```

3. **Upload built files**:
   ```bash
   aws s3 sync dist/ s3://your-hangman-bucket --delete
   ```

4. **Create CloudFront distribution** pointing to your S3 bucket

5. **Update API URL** in production build:
   ```
   VITE_API_URL=https://your-api-gateway-url.amazonaws.com/prod
   ```

### Environment Variables

- `VITE_API_URL` - Backend API endpoint (required)

## API Integration

The frontend expects the API to provide:

**Endpoint**: `GET /word?length={number}`

**Response**:
```json
{
  "word": "ELEPHANT",
  "length": 8,
  "definition": "five-toed pachyderm",
  "attempts": 3
}
```

See [`../api/openapi.yaml`](../api/openapi.yaml) for full API specification.

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with gradients and animations
- **SVG** - Vector graphics for hangman figures

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

When adding new features:

1. Follow existing code style
2. Use TypeScript for type safety
3. Keep components small and focused
4. Add comments for complex logic
5. Test on both desktop and mobile

## License

MIT

## Credits

- Word data powered by NLTK WordNet corpus
- Profanity filtering via better-profanity
