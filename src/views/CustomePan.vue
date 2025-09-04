<template>
  <div class="container">

    <CustomCollapse v-model="activeNames" :accordion="accordion">
      <CustomCollapseItem title="一致性 Consistency" name="1">
        与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
      </CustomCollapseItem>
      
      <CustomCollapseItem title="反馈 Feedback" name="2">
        <template #title>
          <span style="color: #67c23a;">反馈 Feedback</span>
        </template>
        控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
        页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。
      </CustomCollapseItem>
      
      <CustomCollapseItem title="效率 Efficiency" name="3">
        简化流程：设计简洁直观的操作流程；
        清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
        帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
      </CustomCollapseItem>
    </CustomCollapse>
    
    <div class="active-info">
      当前激活项: {{ JSON.stringify(activeNames) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import CustomCollapse from '@/components/CustomCollapse/index.vue'
import CustomCollapseItem from '@/components/CustomCollapse/CollapseItem.vue'

const accordion = ref(true)
const activeNames = ref(1)


</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.control-panel {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.control-panel label {
  display: flex;
  align-items: center;
  gap: 5px;
}

button {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #66b1ff;
}

.active-info {
  margin-top: 20px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}
</style>