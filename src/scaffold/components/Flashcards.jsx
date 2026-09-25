import { useEffect, useState } from 'react'
import GradeButtons from './GradeButtons'

export default function Flashcards({ cards, onGrade }) {
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setI(0)
    setRevealed(false)
  }, [cards])

  if (cards.length === 0) {
    return <p className="text-sm opacity-70">No cards in this lesson yet.</p>
  }

  if (i >= cards.length) {
    return (
      <div className="slab-flat max-w-md bg-paper p-5">
        <p className="text-lg font-bold">Deck finished.</p>
        <button
          onClick={() => {
            setI(0)
            setRevealed(false)
          }}
          className="slab-flat mt-4 bg-accent px-4 py-2 micro"
        >
          Run it again
        </button>
      </div>
    )
  }

  const card = cards[i]

  const answer = (correct) => {
    onGrade?.(card.id, correct)
    setRevealed(false)
    setI((n) => n + 1)
  }

  return (
    <div className="max-w-xl space-y-4">
      <p className="micro opacity-60">
        Card {i + 1} of {cards.length}
      </p>

      <div className="slab flex min-h-52 flex-col justify-center gap-4 bg-paper p-6">
        <p className="text-lg font-bold leading-snug">{card.front}</p>
        {revealed && (
          <p className="border-t-2 border-ink pt-4 text-[15px] leading-relaxed">{card.back}</p>
        )}
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="slab-flat w-full bg-cobalt px-4 py-3 micro text-white"
        >
          Reveal
        </button>
      ) : (
        <GradeButtons onGrade={answer} />
      )}
    </div>
  )
}
