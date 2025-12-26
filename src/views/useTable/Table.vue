<template>
  <el-form :inline="true" :model="localSearchForm">
    <template v-for="formItem in visibleSearchForm" :key="formItem.prop">
      <el-form-item :label="formItem.label">
        <component
          v-if="formItem.type !== 'select'"
          :is="getComponentType(formItem.type)"
          :key="formItem.prop"
          v-bind="formItem.attrs"
          v-model="localSearchForm[(typeof formItem.prop === 'string' ? formItem.prop : formItem.prop[0]) as keyof typeof localSearchForm]"
        ></component>
        <component
          v-else
          :is="getComponentType(formItem.type)"
          :key="formItem.prop + '_select'"
          v-bind="formItem.attrs"
          v-model="localSearchForm[(typeof formItem.prop === 'string' ? formItem.prop : formItem.prop[0]) as keyof typeof localSearchForm]"
          @change="
            formItem.onChange &&
              formItem.onChange(
                localSearchForm,
                localSearchForm[
                  (typeof formItem.prop === 'string' ? formItem.prop : formItem.prop[0]) as keyof typeof localSearchForm
                ]
              )
          "
        >
          <el-option
            v-for="option in formItem.attrs.options || []"
            :label="option.label"
            :value="option.value"
            :key="option.value"
          ></el-option>
        </component>
      </el-form-item>
    </template>

    <el-form-item>
      <el-button icon="Search" type="primary" @click="handleSearch">查询</el-button>
      <el-button icon="Refresh" @click="restSearchForm">重置</el-button>
      <el-button v-show="searchForm.length > 3" text icon="Expand" @click="expand = !expand">
        {{ expand ? "收起" : "展开" }}
      </el-button>
    </el-form-item>
  </el-form>
  <div v-if="buttonsList.length" class="mb-2">
    <el-button
      v-for="btn in buttonsList"
      :key="btn.text"
      :icon="btn.icon"
      v-bind="btn.attrs"
      @click="btn.onClick({ multiple, selectedList })"
      class="mr-2"
    >
      {{ btn.text }}
    </el-button>
  </div>
  <el-table
    :data="tableData"
    v-bind="attrs"
    :loading="loading"
    style="width: 100%"
    @selection-change="
      (val:any) => (selectedList = val)
    "
    @current-change="
      (val:any) => (multiple = val)
    "
    @row-click="
      (row:any, column:any, event:any) => emit('row-click', row, column, event)
    "
  >
  <template v-if="tableTypeIndex.length">
    <te-table-column
      v-for="col in tableTypeIndex"
      :key="col.type"
      :type="col.type"
    />
  </template>
  <template v-for="col in allTable" :key="col.prop">
    <el-table-column
      v-if="!col.buttons"
      :prop="col.prop"
      :label="col.label"
      v-bind="col.attrs"
      :show-overflow-tooltip="col.showTooltip"
    >
      <template #default="{ row }">
        <div v-if="col.render">
          {{ col.render(row) }}
        </div>
     
        <template v-else>
          <slot v-if="col.slot" :name="col.slot" :row="row" :column="col"></slot>
        </template>
      </template>

    </el-table-column>
    <el-table-column
      v-if="col.buttons"
      :label="col.label || '操作'"
      v-bind="col.attrs"
    > 
      <template #default="{ row }">
        <template v-for="btn in getButtons(col, row)" :key="btn.text">
          <el-button
            v-show="btn.show"
            v-bind="btn.attrs"
            :disabled="buttonDisabled(btn, row)"
            @click="btn.onClick(row)"
          >
            {{ btn.text }}
          </el-button>
        </template>
      </template>
    </el-table-column>
  </template>
  </el-table>
  <div v-show="total > 0" class="mt-4 text-right flex justify-end items-center">
    <span> 共 {{ total }} 条</span>
    <el-pagination
      class="ml-auto"
      :current-page="comPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :total="total > 100000 ? 10000 : total"
      layout="sizes,prev,pager,next,jumper"
      @current-change="
        (val:any) => emit('update:pageNo', val)
        fetchData && fetchData()
      "
      @size-change="
        (val:any) => emit('update:pageSize', val)
        fetchData && fetchData()
      "
    >
      </el-pagination>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, PropType, computed } from "vue"
import type { ButtonConfig, TableConfig, TableOptions, UseTableOptions, FormConfig, InputType } from "./types"
const props = defineProps({
  buttonsList: {
    type: Array as PropType<ButtonConfig[]>,
    default: () => []
  },
  columns: {
    type: Array as PropType<TableConfig[]>,
    default: () => []
  },
  searchForm: {
    type: Array as PropType<FormConfig[]>,
    default: () => []
  },
  attrs: {
    type: Object,
    default: () => ({})
  },
  tableData: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageNo: {
    type: Number,
    default: 1
  },
  fetchData: {
    type: Function,
    required: false,
    default: () => () => {}
  },
  handleSearch: {
    type: Function,
    required: false,
    default: () => () => {}
  },
  restSearchForm: {
    type: Function,
    required: false,
    default: () => () => {}
  }
})

const emit = defineEmits<{
  (e: "update:pageNo", value: number): void
  (e: "update:pageSize", value: number): void
  (e: "update:searchForm", value: any): void
  (e: "row-click", row: any, column: any, event: any): void
}>()
const localSearchForm = computed(() => props.searchForm)
const selectedList = ref([])
const multiple = ref<any>([])
const comPage = computed(() => props.pageNo)

watch(
  () => comPage.value,
  (val) => {
    emit("update:pageNo", val)
  }
) 
watch(
  () => props.searchForm,
  (val) => {
    Object.assign(localSearchForm.value, val)
  },
  { deep: true }
)
watch(
  () => localSearchForm.value,
  (val) => {
    emit("update:searchForm", val)
  },
  { deep: true }
)

const getComponentType = (type: InputType) => {
  switch (type) {
    case "input":
      return "el-input"
    case "select":
      return "el-select"
    case "radio":
      return "el-radio-group"
    case "checkbox":
      return "el-checkbox-group"
    case "date":
      return "el-date-picker"
    case "daterange":
      return "el-date-picker"
    default:
      return "el-input"
  }
}
const getButtons = (col: TableConfig, row: any) => {
  try {
    const buttons = typeof col.buttons === "function" ? col.buttons(row) : col.buttons || []
    return buttons.filter((btn) => {
      const show = typeof btn.show === "function" ? btn.show(row) : btn.show !== false
      return show
    })
  } catch (error) {
    return []
  }
}
const buttonDisabled = (btn: ButtonConfig, row: any) => {
  return typeof btn.attrs.disabled === "function" ? btn.attrs.disabled(row) : btn.attrs.disabled
}
const expand = ref(false)
const visibleSearchForm = computed(() => {
  return props.searchForm.slice(0, expand.value ? Infinity : 3)
})
const tableTypeIndex = computed(() => {
  return props.columns.filter((col) => col.type)
})
const allTable = computed(() => {
  return props.columns.filter((col) => !col.type)
})
</script>
