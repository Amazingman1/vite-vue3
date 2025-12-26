<template>
  <!-- <el-input v-focus v-model="value"></el-input> -->

  <el-button type="import" @click="check">校验</el-button>
  <el-button type="primary" @click="cancleViald">取消</el-button>
  <el-button type="primary" @click="showDailog">对话框</el-button>
  <List v-model:min-list="list"></List>
  <Canvas></Canvas>
  <CustomDialog v-model:visible="showDialog" title="快速导入" @confirm="importData">
    <template #default>
      <el-form label-position="top" label-width="100px" class="mt-4">
        <el-form-item label="导入内容">
          <el-input type="textarea" v-model="importContent" placeholder="请输入内容" :rows="10"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </CustomDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomDialog from './CustomDialog.vue'
import List from './List.vue'
import Canvas from './canvas/canva.vue'
const list = ref<any[]>([{ toValue: '', value: '', vaild: false }])
const showDialog = ref(false)
const importContent = ref('')

const check = () => {
  console.log('校验', sbmint())
}
const sbmint = () => {
  if (list.value.length === 1 && !list.value[0].value && !list.value[0].toValue) {
    list.value[0].vaild = false
    return false // 必填
  }
  list.value.forEach(item => {
    if (!item.value || !item.toValue) {
      item.vaild = true
    } else {
      item.vaild = false
    }
  })
  return list.value.every(item => !item.vaild)
}
const cancleViald = () => {
  list.value.forEach(item => {
    item.vaild = false
  })
}
const showDailog = () => {
  showDialog.value = true
}
const importData = () => {
  console.log('导入数据')
  showDialog.value = false
}
</script>

<style lang="scss" scoped>
.imnput {
  width: 100px;
}
</style>