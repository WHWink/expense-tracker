export type TransactionType = 'income' | 'expense'

/** 一笔记账记录 */
export interface Transaction {
  id: string
  type: TransactionType
  /** 金额，恒为正数；加还是减由 type 决定 */
  amount: number
  /** 分类名称 */
  category: string
  /** 记账日期，格式 YYYY-MM-DD */
  date: string
  /** 备注，可选 */
  note?: string
  /** 创建时间（ISO 字符串），用于同一天内的排序 */
  createdAt: string
  // 预留扩展字段（后续版本加入；旧数据兼容统一在 store 层读取时补默认值）：
  // accountId?: string   // 账户
  // tags?: string[]      // 标签
  // attachment?: string  // 附件
}

/** 新建/编辑时的表单数据（id、createdAt 由存储层生成，不可改动） */
export type NewTransaction = Omit<Transaction, 'id' | 'createdAt'>
