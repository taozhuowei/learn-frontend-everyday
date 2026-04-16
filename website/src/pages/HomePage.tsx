/**
 * Page: HomePage
 * Purpose: 主页，展示 CodeForge Hero 区和四大功能入口卡片。
 */

import { BookOpen, ChevronRight, GraduationCap, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AppShell } from '../components/AppShell'
import { knowledgeArticles } from '../generated/knowledge'
import { problems } from '../generated/problems'

const stats = {
  total: problems.length,
  browser: problems.filter((p) => p.executionMode === 'browser').length,
  component: problems.filter((p) => p.executionMode === 'component').length,
  articles: knowledgeArticles.length,
}

type FeatureCard = {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  accent: string
  stat: string
}

const featureCards: FeatureCard[] = [
  {
    title: '学习模式',
    description: '三栏工作区，左侧读题与参考答案，中间写代码，右侧查看样例与提交结果。',
    href: '/learn',
    icon: <BookOpen size={22} />,
    accent: 'amber',
    stat: `${stats.total} 道题目`,
  },
  {
    title: '考试模式',
    description: '从题库随机抽题，完整模拟考试流程：计时、切题、运行、提交与成绩报告。',
    href: '/exam',
    icon: <Trophy size={22} />,
    accent: 'blue',
    stat: `${stats.browser + stats.component} 道可参考`,
  },
  {
    title: '理论知识',
    description: '浏览前端核心知识文档，支持背诵模式隐藏正文、文档内关键词搜索与 TOC 导航。',
    href: '/theory',
    icon: <GraduationCap size={22} />,
    accent: 'emerald',
    stat: `${stats.articles} 篇文章`,
  },
]

const accentMap: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  amber: {
    bg: 'hover:bg-amber-50',
    border: 'hover:border-[var(--color-primary)]',
    icon: 'text-[var(--color-primary)]',
    badge: 'bg-[var(--color-primary-soft)] text-[var(--color-primary-ink)]',
  },
  blue: {
    bg: 'hover:bg-blue-50',
    border: 'hover:border-blue-400',
    icon: 'text-blue-500',
    badge: 'bg-blue-50 text-blue-700',
  },
  emerald: {
    bg: 'hover:bg-emerald-50',
    border: 'hover:border-emerald-400',
    icon: 'text-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
  },
}

export function HomePage() {
  return (
    <AppShell showPageHeader={false} showTopbar={false} title="首页">
      <div className="h-full overflow-y-auto">
        {/* Hero */}
        <div className="relative overflow-hidden bg-white border-b border-[var(--color-border)]">
          {/* 几何光晕装饰 */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="absolute -top-10 left-60 w-64 h-64 rounded-full bg-blue-300/15 blur-3xl" />
            <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-amber-200/25 blur-2xl" />
          </div>

          <div className="relative max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-[9px] bg-[var(--color-primary)] text-white text-sm font-extrabold flex items-center justify-center">
                CF
              </span>
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)]">
                CodeForge
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-ink)] mb-4 leading-tight">
              锻造你的前端
              <br />
              <span className="text-[var(--color-primary)]">实战能力</span>
            </h1>
            <p className="text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-xl mx-auto mb-6">
              {stats.total} 道精心设计的前端题目，{stats.articles} 篇理论知识文档， 浏览器内置 IDE
              即时练习，系统性提升前端核心技术。
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {[
                { label: `${stats.total} 道题目`, color: 'text-[var(--color-primary)]' },
                { label: `${stats.browser} 道自动判题`, color: 'text-blue-500' },
                { label: `${stats.articles} 篇文档`, color: 'text-emerald-500' },
              ].map((item) => (
                <span key={item.label} className={`text-sm font-semibold ${item.color}`}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureCards.map((card) => {
              const a = accentMap[card.accent]
              return (
                <Link
                  key={card.title}
                  className={`group flex items-start gap-4 p-5 rounded-[var(--radius-lg)] bg-white border border-[var(--color-border)] ${a.border} ${a.bg} transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer`}
                  to={card.href}
                >
                  <div
                    className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-secondary)] ${a.icon} mt-0.5`}
                  >
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-[var(--color-ink)]">{card.title}</h3>
                      <span
                        className={`shrink-0 text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full ${a.badge}`}
                      >
                        {card.stat}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={`shrink-0 mt-2 ${a.icon} opacity-0 group-hover:opacity-100 transition-opacity`}
                    size={16}
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
