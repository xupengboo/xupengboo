/* ① 统计数字 */
export interface StatItem {
  value: string
  label: string
}

/* ② 最近更新 */
export interface RecentItem {
  tag: string
  tagClass: string
  title: string
  date: string
  link: string
}

/* ③ 技术栈 */
export interface TechTag {
  name: string
  level: 'level-high' | 'level-mid' | 'level-new'
}

/* ④ 读书推荐 */
export interface BookItem {
  title: string
  author: string
  category: string
  color: string
  score: string
  badge: string
  badgeClass: 'badge-must' | 'badge-classic' | 'badge-mind' | 'badge-starter'
  quote: string
  review: string
  tags: string[]
}

/* ⑤ 成长时间线 */
export interface TimelineItem {
  year: string
  title: string
  tag: string
  color: string
  desc: string
  milestones: string[]
  current?: boolean
}

/* ⑥ 当前状态 */
export interface LearningDoingItem {
  name: string
  pct: number
  color: string
  note: string
}

export interface LearningPlanItem {
  name: string
  time: string
  done: boolean
}

export interface LearningThoughtItem {
  text: string
  from: string
}

export interface LearningData {
  doing: LearningDoingItem[]
  plan: LearningPlanItem[]
  thoughts: LearningThoughtItem[]
}

/* ⑦ 项目展示 */
export interface ProjectItem {
  icon: string
  name: string
  desc: string
  stack: string[]
  status: string
  statusClass: 'status-active' | 'status-lab' | 'status-growing'
  github: string | null
  highlight: string | null
}

/* ⑧ 座右铭 */
export interface MottoData {
  text: string
  from: string
  note: string
}
