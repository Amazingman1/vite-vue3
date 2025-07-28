// src/utils/element-plus-patch.ts
import { ElButton } from 'element-plus'
import { PropType } from 'vue'
// 覆盖原始prop验证
const originalProps = ElButton.props
ElButton.props = {
  ...originalProps,
  type: {
    type: String as PropType<
      | 'default'
      | 'primary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'info'
      | 'text'
      | 'import'
      | 'export'
      | ''
    >,
    default: 'default',
    validator: (value: string) => 
      [
        'default',
        'primary',
        'success',
        'warning',
        'danger',
        'info',
        'text',
        'import',
        'export',
        ''
      ].includes(value)
  }
}