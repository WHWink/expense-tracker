import type { Category } from '../../types/category'

/** 预设分类：只是首次使用的默认值，不是写死的配置；
 *  用户增删后的分类存在 localStorage（见 store/categories.ts）。 */
export const defaultCategories: Category[] = [
  { id: 'exp-food', name: '餐饮', type: 'expense', emoji: '🍜' },
  { id: 'exp-transport', name: '交通', type: 'expense', emoji: '🚌' },
  { id: 'exp-shopping', name: '购物', type: 'expense', emoji: '🛒' },
  { id: 'exp-daily', name: '日用', type: 'expense', emoji: '🧻' },
  { id: 'exp-housing', name: '居住', type: 'expense', emoji: '🏠' },
  { id: 'exp-fun', name: '娱乐', type: 'expense', emoji: '🎮' },
  { id: 'exp-medical', name: '医疗', type: 'expense', emoji: '💊' },
  { id: 'exp-edu', name: '教育', type: 'expense', emoji: '📚' },
  { id: 'exp-phone', name: '通讯', type: 'expense', emoji: '📱' },
  { id: 'exp-travel', name: '旅行', type: 'expense', emoji: '✈️' },
  { id: 'exp-pet', name: '宠物', type: 'expense', emoji: '🐱' },
  { id: 'exp-other', name: '其他', type: 'expense', emoji: '📦' },
  { id: 'inc-salary', name: '工资', type: 'income', emoji: '💰' },
  { id: 'inc-bonus', name: '奖金', type: 'income', emoji: '🎁' },
  { id: 'inc-invest', name: '理财', type: 'income', emoji: '📈' },
  { id: 'inc-parttime', name: '兼职', type: 'income', emoji: '💼' },
  { id: 'inc-redpacket', name: '红包', type: 'income', emoji: '🧧' },
  { id: 'inc-other', name: '其他', type: 'income', emoji: '📦' },
]

/** 按名称查分类图标；分类可能已被删除，查不到时给个兜底图标 */
export function findCategoryEmoji(categories: Category[], name: string): string {
  return categories.find((c) => c.name === name)?.emoji ?? '📌'
}
