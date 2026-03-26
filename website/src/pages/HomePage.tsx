import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { knowledgeArticles } from '../generated/knowledge'
import { problems } from '../generated/problems'

type FeatureLink = {
  title: string
  description: string
  href: string
  meta: string
  tone: 'practice' | 'exam' | 'library' | 'theory'
  emoji: string
}

const firstBrowserProblem =
  problems.find((problem) => problem.executionMode === 'browser') ?? problems[0]
const browserProblemCount = problems.filter((problem) => problem.executionMode === 'browser').length
const localProblemCount = problems.length - browserProblemCount

const featuredLinks: FeatureLink[] = [
  {
    title: '学习模式',
    description: '三栏工作区，左侧读题与答案，中间写代码，右侧看样例、日志与提交结果。',
    href: `/learn/${firstBrowserProblem?.id ?? 'map'}`,
    meta: 'Practice',
    tone: 'practice',
    emoji: '🧩',
  },
  {
    title: '考试模式',
    description: '从网页可运行题里随机抽题，保留计时、切题、运行与提交的完整链路。',
    href: '/exam',
    meta: 'Exam',
    tone: 'exam',
    emoji: '⏱️',
  },
  {
    title: '题库',
    description: '按分类浏览所有题目，区分网页判题题与本地环境题，快速进入详情和学习页。',
    href: '/library',
    meta: 'Library',
    tone: 'library',
    emoji: '📚',
  },
  {
    title: '理论知识',
    description: '直接消费 docs 中的 Markdown 文档，在网站内以稳定阅读布局展示。',
    href: '/theory',
    meta: 'Theory',
    tone: 'theory',
    emoji: '🧠',
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
          <div aria-label="站点概览" className="home-summary-strip" role="list">
            <span className="home-summary-chip" role="listitem">
              {browserProblemCount} 道浏览器判题
            </span>
            <span className="home-summary-chip" role="listitem">
              {localProblemCount} 道本地联调题
            </span>
            <span className="home-summary-chip" role="listitem">
              {knowledgeArticles.length} 篇理论文章
            </span>
          </div>
        </section>

        <section aria-label="主要功能入口" className="home-entry-grid home-entry-grid-landing">
          {featuredLinks.map((item) => (
            <Link
              className={`home-entry-card home-entry-card-${item.tone}`}
              key={item.title}
              to={item.href}
            >
              <div className="home-entry-figure">
                <span aria-hidden="true" className="entry-icon">
                  {item.emoji}
                </span>
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
