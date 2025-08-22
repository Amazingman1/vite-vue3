<template>
  <!-- <el-input v-focus v-model="value"></el-input> -->
  <div class="flex items-center justify-between text-left text-[#a34343] text-[14px]">
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
    <div v-show="item.vaild" class="text-red-500 text-left w-full line-height-[1px]">请填写完整</div>
  </div>

    <div class="m-4">
    <p>default</p>
    <el-select
      v-model="value1"
      multiple
      placeholder="Select"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref,computed ,watch} from 'vue'
import { Plus, Minus } from '@element-plus/icons-vue'
const value1 = ref([])
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
const props = defineProps({
  minList: {
    type: Array as () => Array<{ toValue: string, value: string, vaild: boolean }>,
    default: () => [
    ]
  }
})
watch(
  () => props.minList,
  (val) => {
    if (val.length === 0) {
      list.value.push({ toValue: '', value: '', vaild: false })
    }
  },
  { immediate: true }
)
const emit = defineEmits(['update:minList'])
const list = computed({
  get: () => props.minList,
  set: (val) => {
    return emit('update:minList', val)
  }
})
const showDialog = ref(false)
const plusItem = () => {
  list.value.push({ toValue: '', value: '', vaild: false })
}
const minusItem = (index: number) => {
  list.value.splice(index, 1)
  if (list.value.length === 0) {
    list.value.push({ toValue: '', value: '', vaild: false })
  }
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