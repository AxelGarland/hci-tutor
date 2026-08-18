import { useEffect, useMemo, useState } from 'react'
import Sidebar from './scaffold/components/Sidebar'
import LessonView from './scaffold/components/LessonView'
import ReviewSession from './scaffold/components/ReviewSession'
import StudySession from './scaffold/components/StudySession'
import ExamPlanner from './scaffold/components/ExamPlanner'
import Home from './scaffold/components/Home'
import MobileBar from './scaffold/components/MobileBar'
import { DesignContext } from './scaffold/DesignContext'
import * as store from './scaffold/store'

const PAGE_TITLE = {
  session: 'Study session',
  review: 'Review',
  exam: 'Exam plan',
}

export default function App() {
  const [courseId, setCourseId] = useState(store.activeCourseId)
  const [progress, setProgress] = useState(store.load)
  const [view, setView] = useState({ type: 'home' })
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => store.save(progress), [progress])

  // Switching course swaps the catalog and the progress namespace together. The
  // subtree is keyed on the id below so no component keeps stale course state.
  const chooseCourse = (id) => {
    store.setActiveCourseId(id)
    setCourseId(id)
    setProgress(store.load())
    setView({ type: 'home' })
  }

  const grade = (id, correct, confidence) =>
    setProgress((p) => store.grade(p, id, correct, confidence))

  const due = useMemo(() => store.dueItems(progress), [progress])
  const stats = useMemo(() => store.overallStats(progress), [progress])
  const plan = useMemo(() => store.examPlan(progress), [progress])
  const lesson = store.lessons().find((l) => l.id === view.id)

  // Snapshot the queue when a review starts, so grading does not shrink it mid-run.
  const [queue, setQueue] = useState([])

  const openLesson = (id) => setView({ type: 'lesson', id })
  const atHome = view.type === 'home'

  return (
    <DesignContext.Provider value={{ onOpenChapter: openLesson }}>
      <div key={courseId} className="flex h-full flex-col md:flex-row">
        {/* The home screen is the entry point, so it gets the full width. The
            sidebar returns as soon as you are inside a course. */}
        {!atHome && (
          <MobileBar
            title={view.type === 'lesson' ? lesson?.title : PAGE_TITLE[view.type]}
            open={navOpen}
            onToggle={setNavOpen}
            onHome={() => { setNavOpen(false); setView({ type: 'home' }) }}
          />
        )}

        {/* One sidebar instance. On desktop it is a column; on mobile the same
            component becomes a sheet, so the two never drift apart. */}
        {!atHome && (
          <div
            id="scaffold-nav"
            className={`${
              navOpen ? 'fixed inset-y-0 left-0 z-50 w-[86%] max-w-sm bg-paper shadow-[0_0_60px_rgba(10,10,10,0.35)]' : 'hidden'
            } md:static md:z-auto md:block md:h-full md:w-80 md:max-w-none md:shrink-0 md:border-r md:border-rule md:shadow-none`}
          >
          <Sidebar
            onNavigate={() => setNavOpen(false)}
            progress={progress}
            current={view.type === 'lesson' ? view.id : null}
            activeView={view.type}
            dueCount={due.length}
            examPlan={plan}
            onSelect={openLesson}
            onHome={() => setView({ type: 'home' })}
            onSession={() => setView({ type: 'session' })}
            onExam={() => setView({ type: 'exam' })}
            onReview={() => {
              setQueue(store.sessionQueue(progress))
              setView({ type: 'review' })
            }}
            onReset={() => {
              if (confirm('Erase all progress for this course on this device?')) {
                store.reset()
                setProgress(store.load())
              }
            }}
          />
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {atHome ? (
            <Home
              progress={progress}
              courseId={courseId}
              onCourse={chooseCourse}
              onSelect={openLesson}
              onSession={() => setView({ type: 'session' })}
            />
          ) : (
            <>
              <div className="mx-auto max-w-3xl px-5 py-8 md:px-10">
                {view.type === 'session' && (
                  <StudySession
                    progress={progress}
                    onGrade={grade}
                    onFinish={(record) =>
                      setProgress((p) => {
                        const withSession = store.recordSession(p, record)
                        return record.lesson
                          ? store.markRead(withSession, record.lesson, record.summary)
                          : withSession
                      })
                    }
                    onExit={() => setView({ type: 'home' })}
                  />
                )}

                {view.type === 'exam' && (
                  <ExamPlanner
                    progress={progress}
                    onSetExam={(iso) => setProgress((p) => store.setExam(p, iso))}
                  />
                )}

                {view.type === 'lesson' && <LessonView lesson={lesson} onGrade={grade} />}

                {view.type === 'review' && (
                  <ReviewSession
                    items={queue}
                    onGrade={grade}
                    onExit={() => setView({ type: 'home' })}
                  />
                )}
              </div>

              <footer className="border-t border-rule px-5 py-4 text-[11px] font-bold uppercase tracking-wide muted md:px-10">
                {stats.mastered} mastered · {stats.started - stats.mastered} in progress ·{' '}
                {stats.total - stats.started} untouched
              </footer>
            </>
          )}
        </main>
      </div>
    </DesignContext.Provider>
  )
}
