import { useEffect, useState } from 'react'

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
      <div className="slab-flat max-w-md bg-white p-5">
        <p className="text-lg font-bold">Deck finished.</p>
        <button
          onClick={() => {
            setI(0)
            setRevealed(false)
          }}
          className="slab-flat mt-4 bg-yellow px-4 py-2 text-xs font-bold uppercase tracking-wide"
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
      <p className="text-xs font-bold uppercase tracking-wide opacity-60">
        Card {i + 1} of {cards.length}
      </p>

      <div className="slab flex min-h-52 flex-col justify-center gap-4 bg-white p-6">
        <p className="text-lg font-bold leading-snug">{card.front}</p>
        {revealed && (
          <p className="border-t-2 border-ink pt-4 text-[15px] leading-relaxed">{card.back}</p>
        )}
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="slab-flat w-full bg-blue px-4 py-3 text-xs font-bold uppercase tracking-wide text-white"
        >
          Reveal
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => answer(false)}
            className="slab-flat flex-1 bg-red px-4 py-3 text-xs font-bold uppercase tracking-wide text-white"
          >
            Missed it
          </button>
          <button
            onClick={() => answer(true)}
            className="slab-flat flex-1 bg-teal px-4 py-3 text-xs font-bold uppercase tracking-wide text-white"
          >
            Knew it
          </button>
        </div>
      )}
    </div>
  )
}
