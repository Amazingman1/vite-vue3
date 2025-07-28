// src/types/element-plus.d.ts
import { ElButton } from 'element-plus'

declare module 'element-plus' {
  // 扩展 ElButton 的 props 类型
  export interface ElButtonProps {
    /**
     * 按钮类型
     * @default 'default'
     */
    type?: 
      | 'default' 
      | 'primary' 
      | 'success' 
      | 'warning' 
      | 'danger' 
      | 'info' 
      | 'text' 
      | 'import' 
  }
  
  // 扩展按钮的原始类型定义（确保类型兼容）
  export interface ButtonProps extends ElButtonProps {}
}