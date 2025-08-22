<template>
  <div>
    <CustomTabs v-model="activeTab" @tab-click="handleTabClick" @tab-close="handleTabClose">
      <TabPane label="用户管理" :name="0">
        <UserManagement />
      </TabPane>
      <TabPane label="配置管理" :name="1" disabled>
        <ConfigManagement />
      </TabPane>
    </CustomTabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CustomTabs from './Tabs.vue'
import TabPane from './TabPane.vue'
import UserManagement from './UserManagement.vue'
import ConfigManagement from './ConfigManagement.vue'

const activeTab = ref(0)

function handleTabClose(name: string) {
  console.log('关闭标签:', name)
}
const handleTabClick = (name: string) => {
  console.log('点击标签:', name)
}
</script>