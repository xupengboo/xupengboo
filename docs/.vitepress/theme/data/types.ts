// ============================================================
// HomeStats 数据类型定义
// ============================================================

/** ① 统计数字 */
export interface StatItem {
  value: string
  label: string
}

/** ② 最近更新 */
export type TagClass = 'tag-ai' | 'tag-dev' | 'tag-ops'

export interface RecentItem {
  tag: string
  tagClass: TagClass
  title: string
  date: string
  link: string
}

/** ③ 技术栈 */
export type TagLevel = 'level-high' | 'level-mid' | 'level-new'

export interface TechTag {
  name: string
  level: TagLevel
}

/** ④ 读书推荐 */
export interface BookItem {
  title: string
  author: string
  category: string
  /** 十六进制颜色，用于书脊和分类文字 */
  color: string
  score: string
  badge: string
  badgeClass: string
  quote: string
  review: string
  tags: string[]
}

/** ⑤ 成长时间线 */
export interface TimelineItem {
  year: string
  title: string
  tag: string
  color: string
  desc: string
  milestones: string[]
  /** 是否为当前节点，高亮显示 */
  current?: boolean
}

/** ⑥ 当前状态 */
export interface LearningDoing {
  name: string
  /** 学习进度 0~100 */
  pct: number
  color: string
  note: string
}

export interface LearningPlan {
  name: string
  time: string
  done: boolean
}

export interface LearningThought {
  text: string
  from: string
}

export interface LearningData {
  doing: LearningDoing[]
  plan: LearningPlan[]
  thoughts: LearningThought[]
}

/** ⑦ 项目展示 */
export interface ProjectItem {
  icon: string
  name: string
  desc: string
  stack: string[]
  status: string
  statusClass: string
  github: string | null
  highlight: string | null
}

/** ⑧ 座右铭 */
export interface Motto {
  text: string
  from: string
  note: string
}

/** 完整的首页数据结构 */
export interface HomeData {
  stats: StatItem[]
  recent: RecentItem[]
  tags: TechTag[]
  books: BookItem[]
  timeline: TimelineItem[]
  learning: LearningData
  projects: ProjectItem[]
  motto: Motto
}
