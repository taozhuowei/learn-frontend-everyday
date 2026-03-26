import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { knowledgeArticles } from '../generated/knowledge'
import { problems } from '../generated/problems'

function PracticeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M6 4.75h8.5L19.25 9.5V19A1.25 1.25 0 0 1 18 20.25H6A1.25 1.25 0 0 1 4.75 19V6A1.25 1.25 0 0 1 6 4.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14 4.75V9.5h4.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 12.25h8M8 15.75h5.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function ExamIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" fill="none" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 8.5V12l2.5 2.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M8 3.75H5.75M18.25 3.75H16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function LibraryIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M6.5 5.25h9.75A2.5 2.5 0 0 1 18.75 7.75v10.5H8.75A2.5 2.5 0 0 0 6.5 19.7V5.25Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.5 6.5A2.75 2.75 0 0 0 3.75 9.25V17a2 2 0 0 0 2 2h2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.5 9.25h5.5M9.5 12.25h5.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function TheoryIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M5.25 6.25A2.5 2.5 0 0 1 7.75 3.75h8.5a2.5 2.5 0 0 1 2.5 2.5v11.5l-5.5-2.75-5.5 2.75V6.25Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 8.75h6M9 11.75h4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

type FeatureLink = {
  title: string
  description: string
  href: string
  meta: string
  tone: 'practice' | 'exam' | 'library' | 'theory'
  icon: ReactNode
}

const firstBrowserProblem =
  problems.find((problem) => problem.executionMode === 'browser') ?? problems[0]

const featuredLinks: FeatureLink[] = [
  {
    title: '学习模式',
    description: '三栏工作区，左侧读题与答案，中间写代码，右侧看样例、日志与提交结果。',
    href: `/learn/${firstBrowserProblem?.id ?? 'map'}`,
    meta: 'Practice',
    tone: 'practice',
    icon: <PracticeIcon />,
  },
  {
    title: '考试模式',
    description: '从网页可运行题里随机抽题，保留计时、切题、运行与提交的完整链路。',
    href: '/exam',
    meta: 'Exam',
    tone: 'exam',
    icon: <ExamIcon />,
  },
  {
    title: '题库',
    description: '按分类浏览所有题目，区分网页判题题与本地环境题，快速进入详情和学习页。',
    href: '/library',
    meta: 'Library',
    tone: 'library',
    icon: <LibraryIcon />,
  },
  {
    title: '理论知识',
    description: '直接消费 docs 中的 Markdown 文档，在网站内以稳定阅读布局展示。',
    href: '/theory',
    meta: 'Theory',
    tone: 'theory',
    icon: <TheoryIcon />,
  },
]

export function HomePage() {
  return (
    <AppShell showPageHeader={false} showTopbar={false} title="前端代码实战演练">
      <div className="home-stage home-stage-landing">
        <section className="home-compact-header home-compact-header-landing">
          <span className="eyebrow">Atelier Code</span>
          <h1>前端代码实战演练</h1>
          <p>
            当前站点收录 {problems.length} 道题目与 {knowledgeArticles.length} 篇理论文档。
            首页只保留四个主入口，让内容结构、练习方式和阅读路径一眼可见。
          </p>
        </section>

        <section aria-label="主要功能入口" className="home-entry-grid home-entry-grid-landing">
          {featuredLinks.map((item) => (
            <Link
              className={`home-entry-card home-entry-card-${item.tone}`}
              key={item.title}
              to={item.href}
            >
              <div className="home-entry-figure">
                <span className="entry-icon">{item.icon}</span>
                <span className="entry-geometry entry-geometry-dot" />
                <span className="entry-geometry entry-geometry-line" />
              </div>
              <div className="home-entry-copy">
                <span className="poster-link-meta">{item.meta}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <span aria-hidden="true" className="entry-arrow">
                →
              </span>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  )
}
