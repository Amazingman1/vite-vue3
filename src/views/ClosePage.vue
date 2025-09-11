<template>
  <div>
    <h1>页面关闭监听示例</h1>
    <p>页面状态: {{ isPageClosing ? '正在关闭...' : '正常运行' }}</p>
    <p>未保存的更改: {{ unsavedChanges ? '有' : '无' }}</p>
    <button @click="unsavedChanges = !unsavedChanges">
      切换未保存更改状态
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePageClose } from '@/hook/usePageClose';

// 模拟未保存的更改状态
const unsavedChanges = ref(false);

// 使用页面关闭监听 Hook
const { isPageClosing } = usePageClose({


  
  enableTimeDiff: true // 启用区分刷新和关闭
});
</script>