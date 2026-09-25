import { useEffect, useState } from 'react'
import Reading from './Reading'
import Quiz from './Quiz'
import Flashcards from './Flashcards'
import { demos } from '../store'

export default function LessonView({ lesson, onGrade }) {
  const keys = (lesson.demos ?? []).filter((k) => demos()[k])
  const tabs = [
    { key: 'read', label: 'Read' },
    ...keys.map((k) => ({ key: `demo:${k}`, label: demos()[k].tab })),
    { key: 'cards', label: `Cards (${lesson.cards?.length ?? 0})` },
    { key: 'quiz', label: `Quiz (${lesson.quiz?.length ?? 0})` },
  ]
  const [tab, setTab] = useState('read')

  useEffect(() => setTab('read'), [lesson.id])

  const activeDemo = tab.startsWith('demo:') ? demos()[tab.slice(5)] : null

  return (
    <div className="space-y-6">
      {/* The number is set as a figure rather than as part of the sentence: it
          is the one thing on the page you navigate by. */}
      <header>
        <p className="micro text-cobalt">{lesson.moduleTitle}</p>
        <div className="mt-2.5 flex items-start gap-4">
          <span className="numeral shrink-0 text-5xl text-cobalt sm:text-6xl">{lesson.number}</span>
          <h2 className="text-balance text-2xl font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-4xl">
            {lesson.title}
          </h2>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2 border-b-2 border-ink pb-3.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            aria-current={tab === t.key ? 'true' : undefined}
            className={`slab-flat px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] ${
              tab === t.key ? 'border-cobalt bg-cobalt text-paper' : 'bg-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'read' && <Reading blocks={lesson.reading} />}

      {activeDemo && (
        <div className="space-y-3">
          <h3 className="micro">{activeDemo.title}</h3>
          <activeDemo.Component />
        </div>
      )}

      {tab === 'cards' && <Flashcards cards={lesson.cards ?? []} onGrade={onGrade} />}

      {tab === 'quiz' && <Quiz questions={lesson.quiz ?? []} onGrade={onGrade} />}
    </div>
  )
}
