// src/directives/focus.ts
import { nextTick, type Directive, type DirectiveBinding } from 'vue'

/**
 * 指令绑定值类型
 */
type FocusBindingValue = boolean | undefined

/**
 * 指令修饰符类型
 */
type FocusModifiers = {
  delay?: boolean
  select?: boolean
  scroll?: boolean
}

/**
 * 可聚焦元素接口
 * 扩展 HTMLElement 确保包含必要方法
 */
interface FocusElement extends HTMLElement {
  focus: () => void
  select?: () => void
  // scrollIntoView?: (arg?: boolean | ScrollIntoViewOptions) => void
}

/**
 * 获取可聚焦的真实元素（兼容 el-input 等组件）
 */
function getFocusableElement(el: HTMLElement): HTMLElement {
  // 如果是 el-input 组件，查找内部 input 或 textarea
  if (el.classList.contains('el-input') || el.classList.contains('el-textarea')) {
    const input = el.querySelector('input, textarea')
    if (input) return input as HTMLElement
  }
  // 默认返回自身
  return el
}
/**
 * 检查元素是否可安全聚焦
 * @param el 要检查的元素
 * @returns 是否可聚焦
 */
const isFocusable = (el: FocusElement): boolean => {
  const target = getFocusableElement(el)
  const isDisabled = 'disabled' in target && (target as HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement).disabled
  if (!target.offsetParent || isDisabled || target.getAttribute('aria-disabled') === 'true') {
    return false
  }

  let parent: HTMLElement | null = target.parentElement
  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent)
    if (
      parent.hasAttribute('aria-hidden') ||
      parent.hasAttribute('inert') ||
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.opacity === '0'
    ) {
      return false
    }
    parent = parent.parentElement
  }
  return true
}

/**
 * 安全聚焦元素
 * @param el 要聚焦的元素
 * @param options 聚焦选项
 * @returns 是否聚焦成功
 */
const safeFocus = (
  el: FocusElement,
  options: { select?: boolean; scroll?: boolean } = {}
): boolean => {
  const target = getFocusableElement(el)
  if (!isFocusable(target as FocusElement)) return false

  try {
    target.focus()
    if (document.activeElement === target) {
      if (options.select && typeof (target as any).select === 'function') {
        (target as any).select()
      }
      if (options.scroll && typeof target.scrollIntoView === 'function') {
        const scrollOptions: ScrollIntoViewOptions = {
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        }
        target.scrollIntoView(scrollOptions)
      }
      return true
    }
  } catch (e) {
    console.error('Focus failed:', e)
  }
  return false
}
/**
 * 自定义 v-focus 指令实现
 */
const focusDirective: Directive<FocusElement, FocusBindingValue> = {
  /**
   * 元素挂载时调用
   */
  mounted(el, binding) {
    const modifiers: FocusModifiers = binding.modifiers
    // 确保元素支持 focus 方法
    if (typeof el.focus !== 'function') return
    
   const focusOptions = {
    select: modifiers.select,
    scroll: modifiers.scroll
  }

    /**
     * 尝试聚焦元素
     * @param retries 剩余重试次数
     * @param interval 重试间隔(ms)
     * @returns 是否聚焦成功
     */
    const attemptFocus = (retries = 3, interval = 50): boolean => {
      if (safeFocus(el, focusOptions)) return true
      
      // 如果聚焦失败且还有重试次数，则延迟重试
      if (retries > 0) {
        setTimeout(() => attemptFocus(retries - 1, interval), interval)
        return false
      }
      
      console.warn(`无法聚焦元素:`, el)
      return false
    }

    // 如果绑定值不为 false，则执行聚焦
    if (binding.value !== false) {
      if (binding.modifiers.delay) {
        // 处理延迟聚焦
        const delayTime = typeof binding.arg === 'string' ? parseInt(binding.arg) : 100
        setTimeout(() => attemptFocus(), delayTime)
      } else {
        // 下一帧立即聚焦
        nextTick(() => attemptFocus())
      }
    }
  },

  /**
   * 绑定值更新时调用
   */
  updated(el, binding) {
    // 只有当绑定值从 false 变为 true 时才重新聚焦
    if (binding.value !== binding.oldValue && binding.value) {
      nextTick(() => safeFocus(el, {
        select: binding.modifiers.select,
        scroll: binding.modifiers.scroll
      }))
    }
  },

  /**
   * 元素卸载时调用
   */
  unmounted(el) {
    // 如果当前元素有焦点，则移除焦点
    if (document.activeElement === el) {
      el.blur()
    }
  }
}

export default focusDirective