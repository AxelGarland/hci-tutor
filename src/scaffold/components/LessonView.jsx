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
      <header>
        <p className="text-xs font-bold uppercase tracking-widest opacity-60">
          {lesson.moduleTitle}
        </p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight">
          <span className="muted">{lesson.number}.</span> {lesson.title}
        </h2>
      </header>

      <nav className="flex flex-wrap gap-2 border-b-2 border-ink pb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`slab-flat px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide ${
              tab === t.key ? 'bg-ink text-paper' : 'bg-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'read' && <Reading blocks={lesson.reading} />}

      {activeDemo && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide">{activeDemo.title}</h3>
          <activeDemo.Component />
        </div>
      )}

      {tab === 'cards' && <Flashcards cards={lesson.cards ?? []} onGrade={onGrade} />}

      {tab === 'quiz' && <Quiz questions={lesson.quiz ?? []} onGrade={onGrade} />}
    </div>
  )
}
