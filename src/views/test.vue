<template>
  <div style="padding: 20px">
    <h3>自定义 Tag 插槽的 Select（适配 2.2.27）</h3>
    <CustomSelect
      v-model="selectedList"
      :options="customOptions"
      @remove-tag="handleRemove"
    />
    <div style="margin-top: 16px; color: #666">
      当前选中：{{ selectedList || '无' }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CustomSelect from './CustomSelect.vue';

// 选中值
const selectedList = ref('');

// 自定义选项（可替换为业务数据）
const customOptions = ref([
  { label: 'Vue', value: 'vue', color: '#4FC08D' },
  { label: 'React', value: 'react', color: '#61DAFB' },
  { label: 'Angular', value: 'angular', color: '#DD0031' },
  { label: 'Svelte', value: 'svelte', color: '#FF3E00' },
]);

// 移除标签回调
const handleRemove = (value) => {
  console.log('移除标签：', value);
};
</script>