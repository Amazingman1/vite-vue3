<template>
  <!-- <el-input v-focus v-model="value"></el-input> -->

  <el-button type="import" @click="sbmint">测试新增按钮类型</el-button>
  <el-button type="primary" @click="cancleViald">取消</el-button>
  <el-button type="primary" @click="showDailog">对话框</el-button>
  <div class="flex items-center justify-between text-left ">
    <div class="flex-1">变量值</div>
    <div class="flex-1 pl-[30px]">转化值</div>
  </div>
  <div v-for="(item, index) in list" :key="index" class="h-[56px]">
    <div class="flex items-center gap-[20px] mt-2 ">
      <div>
        <el-input class="imnput" placeholder="请输入内容" v-model="item.value"></el-input>
      </div>
      <div>转化为</div>
      <div>
        <el-input class="imnput" v-model="item.toValue" placeholder="请输入内容"></el-input>
      </div>
      <div>
        <el-button :icon="Plus" circle type="primary" size="small" @click="plusItem" />
        <el-button :icon="Minus" circle type="primary" size="small" @click="minusItem(index)" />
      </div>
    </div>
    <div v-show="item.vaild" class="text-red-500 text-left w-full line-height-normal">请填写完整</div>
  </div>
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
import { Plus, Minus } from '@element-plus/icons-vue'
import CustomDialog from './CustomDialog.vue'
const list = ref([{ toValue: '', value: '', vaild: false }])
const showDialog = ref(false)
const plusItem = () => {
  list.value.push({ toValue: '', value: '', vaild: false })
}
const importContent = ref('')
const minusItem = (index: number) => {
  list.value.splice(index, 1)
  if (list.value.length === 0) {
    list.value.push({ toValue: '', value: '', vaild: false })
  }
}
const sbmint = () => {
  if (list.value.length === 1 && !list.value[0].value && !list.value[0].toValue) {
    list.value[0].vaild = false
    return
  }
  list.value.forEach(item => {
    if (!item.value || !item.toValue) {
      item.vaild = true
    } else {
      item.vaild = false
    }
  })
  console.log(list.value)
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