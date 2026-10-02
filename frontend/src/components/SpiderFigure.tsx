import type { Difficulty } from '../types'

interface SpiderFigureProps {
  wrongGuesses: number
  difficulty: Difficulty
}

const PIECES_TO_SHOW = {
  easy: 10,
  hard: 6,
} as const

const WEB_CENTER = { x: 100, y: 125 }

const WEB_SPOKE_COUNT = 10
const WEB_SPOKE_RADIUS = 100

// Spokes at even angles, starting straight up and going clockwise
const WEB_SPOKES = Array.from({ length: WEB_SPOKE_COUNT }, (_, i) => {
  const angle = (i / WEB_SPOKE_COUNT) * 2 * Math.PI
  return { dx: Math.sin(angle), dy: -Math.cos(angle) }
})

// Distance from the center at which each ring's corners sit on the spokes
const WEB_RING_RADII = [31, 62, 92] as const

// How far each strand sags toward the center between spokes (0 = straight)
const WEB_RING_SAG = 0.12

function webRingPath(radius: number) {
  const corners = WEB_SPOKES.map(({ dx, dy }) => ({
    x: WEB_CENTER.x + dx * radius,
    y: WEB_CENTER.y + dy * radius,
  }))
  const first = corners[0]
  const segments = corners.map((from, i) => {
    const to = corners[(i + 1) % corners.length]
    const sag = 1 - WEB_RING_SAG
    const cx = WEB_CENTER.x + ((from.x + to.x) / 2 - WEB_CENTER.x) * sag
    const cy = WEB_CENTER.y + ((from.y + to.y) / 2 - WEB_CENTER.y) * sag
    return `Q${cx} ${cy} ${to.x} ${to.y}`
  })
  return `M${first.x} ${first.y} ${segments.join(' ')}Z`
}

export default function SpiderFigure({
  wrongGuesses,
  difficulty,
}: SpiderFigureProps) {
  const maxPieces = PIECES_TO_SHOW[difficulty]
  const piecesToDraw = Math.min(wrongGuesses, maxPieces)

  return (
    <svg
      width="300"
      height="350"
      viewBox="0 0 200 250"
      className="hangman-figure"
    >
      {/* Larger Spider Web - centered */}
      <g className="spider-web">
        {/* Radial threads from center */}
        {WEB_SPOKES.map(({ dx, dy }) => (
          <line
            key={`${dx}-${dy}`}
            x1={WEB_CENTER.x}
            y1={WEB_CENTER.y}
            x2={WEB_CENTER.x + dx * WEB_SPOKE_RADIUS}
            y2={WEB_CENTER.y + dy * WEB_SPOKE_RADIUS}
            className="web-thread"
            strokeWidth="2"
          />
        ))}

        {/* Connecting threads - rings with corners on the spokes */}
        {WEB_RING_RADII.map((radius) => (
          <path
            key={radius}
            d={webRingPath(radius)}
            className="web-circle"
            strokeWidth="2"
            fill="none"
          />
        ))}
      </g>

      {/* Spider parts - sitting at web center */}
      {/* 1. Body */}
      {piecesToDraw >= 1 && (
        <ellipse
          cx="100"
          cy="135"
          rx="18"
          ry="28"
          className="figure-part"
          strokeWidth="3"
          fill="none"
        />
      )}

      {/* 2. Head */}
      {piecesToDraw >= 2 && (
        <circle
          cx="100"
          cy="105"
          r="15"
          className="figure-part"
          strokeWidth="3"
          fill="none"
        />
      )}

      {/* 3. Leg pair 1 - left */}
      {piecesToDraw >= 3 && (
        <>
          <line
            x1="88"
            y1="110"
            x2="55"
            y2="95"
            className="figure-part"
            strokeWidth="3"
          />
          <line
            x1="55"
            y1="95"
            x2="30"
            y2="110"
            className="figure-part"
            strokeWidth="3"
          />
        </>
      )}

      {/* 4. Leg pair 1 - right */}
      {piecesToDraw >= 4 && (
        <>
          <line
            x1="112"
            y1="110"
            x2="145"
            y2="95"
            className="figure-part"
            strokeWidth="3"
          />
          <line
            x1="145"
            y1="95"
            x2="170"
            y2="110"
            className="figure-part"
            strokeWidth="3"
          />
        </>
      )}

      {/* 5. Leg pair 2 - left */}
      {piecesToDraw >= 5 && (
        <>
          <line
            x1="88"
            y1="130"
            x2="50"
            y2="120"
            className="figure-part"
            strokeWidth="3"
          />
          <line
            x1="50"
            y1="120"
            x2="20"
            y2="125"
            className="figure-part"
            strokeWidth="3"
          />
        </>
      )}

      {/* 6. Leg pair 2 - right */}
      {piecesToDraw >= 6 && (
        <>
          <line
            x1="112"
            y1="130"
            x2="150"
            y2="120"
            className="figure-part"
            strokeWidth="3"
          />
          <line
            x1="150"
            y1="120"
            x2="180"
            y2="125"
            className="figure-part"
            strokeWidth="3"
          />
        </>
      )}

      {/* Easy mode additional pieces - legs 5-8 */}
      {/* 7. Leg pair 3 - left */}
      {difficulty === 'easy' && piecesToDraw >= 7 && (
        <>
          <line
            x1="88"
            y1="145"
            x2="50"
            y2="155"
            className="figure-part"
            strokeWidth="3"
          />
          <line
            x1="50"
            y1="155"
            x2="20"
            y2="160"
            className="figure-part"
            strokeWidth="3"
          />
        </>
      )}

      {/* 8. Leg pair 3 - right */}
      {difficulty === 'easy' && piecesToDraw >= 8 && (
        <>
          <line
            x1="112"
            y1="145"
            x2="150"
            y2="155"
            className="figure-part"
            strokeWidth="3"
          />
          <line
            x1="150"
            y1="155"
            x2="180"
            y2="160"
            className="figure-part"
            strokeWidth="3"
          />
        </>
      )}

      {/* 9. Leg pair 4 - left */}
      {difficulty === 'easy' && piecesToDraw >= 9 && (
        <>
          <line
            x1="88"
            y1="160"
            x2="55"
            y2="175"
            className="figure-part"
            strokeWidth="3"
          />
          <line
            x1="55"
            y1="175"
            x2="30"
            y2="190"
            className="figure-part"
            strokeWidth="3"
          />
        </>
      )}

      {/* 10. Leg pair 4 - right (8 legs total) */}
      {difficulty === 'easy' && piecesToDraw >= 10 && (
        <>
          <line
            x1="112"
            y1="160"
            x2="145"
            y2="175"
            className="figure-part"
            strokeWidth="3"
          />
          <line
            x1="145"
            y1="175"
            x2="170"
            y2="190"
            className="figure-part"
            strokeWidth="3"
          />
        </>
      )}
    </svg>
  )
}
