<template>
  <el-select
    v-model="selectedValues"
    placeholder="请选择"
    style="width: 100%; max-width: 400px"
    ref="selectRef"
    @visible-change="handleVisibleChange"
  >
    <!-- 核心：prefix 插槽模拟 tag 插槽（自定义选中标签） -->
    <template #prefix>
      <div class="custom-tag">
        <!-- 自定义选中内容 -->
        <span v-if="selectedValues" style="color: #333333; font-size: 12px; padding: 0 4px">
          {{ getLabelByValue(selectedValues) }}
        </span>
        <!-- 自定义占位符（替代原生） -->
        <span v-else style="color: #999; font-size: 14px">请选择</span>
        <span v-if="selectedValues" style="color: #999; font-size: 12px">类型</span>
      </div>
      <el-icon><WarningFilled /></el-icon>
    </template>

    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [
      { label: '选项1', value: 'opt1' },
      { label: '选项2', value: 'opt2' },
      { label: '选项3', value: 'opt3' },
      { label: '选项4', value: 'opt4' },
    ],
  },
});

const selectedValues = ref(props.modelValue);
const selectRef = ref(null);
const emit = defineEmits(['update:modelValue']);


// 核心：移除原生的选中项/占位符节点
const removeNativeNodes = () => {
  if (!selectRef.value) return;
  const el = selectRef.value.$el;
  // 移除原生选中项文本节点
  const selectedItem = el.querySelector('.el-select__selected-item');
  if (selectedItem) selectedItem.remove();
  // 移除原生占位符节点
  const placeholder = el.querySelector('.el-select__placeholder');
  if (placeholder) placeholder.remove();
};
// 同步选中值
watch(selectedValues, (newVal) => {
  emit('update:modelValue', newVal);
  // 选中值变化后，移除原生节点
  nextTick(removeNativeNodes);
}, { deep: true });

// 下拉展开/收起时，移除原生节点
const handleVisibleChange = () => {
  nextTick(removeNativeNodes);
};

// 初始化时移除原生节点
nextTick(removeNativeNodes);

// 根据值获取标签文本
const getLabelByValue = (value) => {
  const target = props.options.find(item => item.value === value);
  return target ? target.label : '';
};
</script>

<style scoped>
/* 彻底隐藏原生输入框相关节点（兜底） */
:deep(.el-select__input) {
  display: none !important; /* 直接隐藏原生输入框，避免残留 */
}
:deep(.el-select__selected-item),
:deep(.el-select__placeholder) {
  display: none !important; /* 兜底隐藏，防止节点未移除时显示 */
}

/* prefix插槽：自定义内容容器 */
:deep(.el-select__prefix) {
  width: calc(100% - 30px); /* 预留给箭头 */
  height: 100%;
  padding-left: 8px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 0;
}

/* 自定义标签样式 */
.custom-tag {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

/* 下拉箭头：水平垂直居中 */
:deep(.el-select__suffix) {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

/* 输入框容器：定位基准 */
:deep(.el-select__wrapper) {
  position: relative;
  height: 100%;
}

/* 确保select整体布局 */
:deep(.el-select) {
  display: inline-flex;
  align-items: center;
}
</style>