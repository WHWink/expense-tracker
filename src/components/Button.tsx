import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost'
}

const variantClass: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-indigo-600 text-white active:bg-indigo-700',
  danger: 'border border-rose-200 bg-rose-50 text-rose-600 active:bg-rose-100',
  ghost: 'text-slate-500 active:bg-slate-100',
}

/** 通用按钮：大触控区、按下有变色反馈（移动端手感） */
export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-xl px-4 py-3 text-base font-medium transition-colors disabled:opacity-60 ${variantClass[variant]} ${className}`}
      {...rest}
    />
  )
}
