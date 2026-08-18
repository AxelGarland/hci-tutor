import { useEffect, useState } from 'react'

export default function Quiz({ questions, onGrade, onFinish }) {
  const [i, setI] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    setI(0)
    setChosen(null)
    setScore(0)
  }, [questions])

  if (questions.length === 0) {
    return <p className="text-sm opacity-70">No questions in this lesson yet.</p>
  }

  if (i >= questions.length) {
    return (
      <div className="slab-flat max-w-md bg-white p-5">
        <p className="text-2xl font-bold">
          {score} / {questions.length}
        </p>
        <p className="mt-1 text-sm opacity-70">
          Wrong answers come back tomorrow. Correct ones move further out.
        </p>
        <button
          onClick={() => {
            setI(0)
            setChosen(null)
            setScore(0)
            onFinish?.()
          }}
          className="slab-flat mt-4 bg-yellow px-4 py-2 text-xs font-bold uppercase tracking-wide"
        >
          Again
        </button>
      </div>
    )
  }

  const q = questions[i]
  const answered = chosen !== null

  const choose = (idx) => {
    if (answered) return
    setChosen(idx)
    const correct = idx === q.answer
    if (correct) setScore((s) => s + 1)
    onGrade?.(q.id, correct)
  }

  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-xs font-bold uppercase tracking-wide opacity-60">
        Question {i + 1} of {questions.length}
      </p>
      <p className="text-lg font-bold leading-snug">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          const isAnswer = idx === q.answer
          const isChosen = idx === chosen
          let tone = 'bg-white hover:bg-yellow'
          if (answered && isAnswer) tone = 'bg-ink text-paper'
          else if (answered && isChosen) tone = 'bg-white'
          else if (answered) tone = 'bg-white muted'
          // Colour alone never carries the verdict — every state is also named (Ch. 17).
          const mark = answered && isAnswer ? 'Correct' : answered && isChosen ? 'Your answer' : null
          return (
            <button
              key={idx}
              onClick={() => choose(idx)}
              disabled={answered}
              className={`slab-flat flex w-full items-baseline gap-3 px-4 py-3 text-left text-[15px] ${tone}`}
            >
              <span className="flex-1">{opt}</span>
              {mark && (
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest">
                  {mark}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="space-y-3">
          <p className="border-l-4 border-ink bg-white px-4 py-3 text-sm leading-relaxed">{q.why}</p>
          <button
            onClick={() => {
              setChosen(null)
              setI((n) => n + 1)
            }}
            className="slab-flat bg-blue px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white"
          >
            {i + 1 === questions.length ? 'See score' : 'Next'}
          </button>
        </div>
      )}
    </div>
  )
}
