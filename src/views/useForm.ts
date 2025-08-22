import { ref, type Ref, watchEffect } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export function useForm<T extends object>(
  formRef: Ref<FormInstance | undefined>,
  formModel: Ref<T>,
  formRules?: Ref<FormRules<T>>,
  /**
   * 是否使用自定义重置逻辑（默认使用Element的resetFields）
   * 设为true时，需要提供initialValue
   */
  options?: {
    customReset?: boolean
    initialValue?: T
  }
) {
  // 记录初始值
  const initialValue = ref<T | null>({ ...formModel.value })
  
  // 如果传入了options中的initialValue，则使用它
  if (options?.initialValue) {
    initialValue.value = { ...options.initialValue }
  }

  // 监听formModel变化更新initialValue（可选）
  watchEffect(() => {
    if (!options?.customReset) {
      initialValue.value = { ...formModel.value }
    }
  })

  /**
   * 重置表单
   */
  const resetForm = () => {
    if (!formRef.value) return
    
    if (options?.customReset) {
      // 自定义重置逻辑
      Object.keys(formModel.value).forEach(key => {
        const typedKey = key as keyof T
        formModel.value[typedKey] = initialValue.value![typedKey]
      })
      
      // 清除验证状态
      formRef.value.clearValidate()
    } else {
      // 使用Element内置的重置方法
      formRef.value.resetFields()
    }
  }

  /**
   * 更新初始值（用于重置基准）
   */
  const updateInitialValue = (newValue: T) => {
    initialValue.value = { ...newValue }
  }

  // 其他方法（clearValidate, validateForm）保持不变...
  // ...

  return {
    resetForm,
    updateInitialValue,
    // ...其他方法
  }
}