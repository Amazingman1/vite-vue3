import { defineComponent, h } from "vue"
import { useTable } from "./index"
import Table from "./Table.vue"
import type { TableOptions } from "./types"
export function useTableAuto(options: TableOptions) {
  return defineComponent({
    name: "Table",
    emits: ["expose", "row-click"],
    setup(_, { slots, expose, emit }) {
      const { searchForm, tableData, total, pageNo, pageSize, fetchData, handleSearch, handleReset } = useTable(
        options.api,
        {
          defaultParams: options.defaultParams,
          parsseResponse: options.parseResponse,
          apiConfig: options.apiConfig,
          pageField: options.pageField,
          sizeField: options.sizeField
        }
      )
      const handleChangePage = (newPage: number) => {
        pageNo.value = newPage
      }
      const handleChangeSize = (newSize: number) => {
        pageSize.value = newSize
      }
      const handleRowClick = (row: any, column: any, event: Event) => {
        options.onRowClick?.(row, column, event)
        emit("row-click", row)
      }
      const refreshTable = () => fetchData()
      // 暴露给父组件
      expose({
        refreshTable
      })
      fetchData()
      return () => {
        const slotFns = Object.keys(slots).reduce((acc, key) => {
          acc[key] = slots[key]
          return acc
        }, {} as Record<string, any>)
        return h(Table, {
          searchForm: searchForm.value,
          tableData: tableData.value,
          searchConfig: options.searchConfig,
          columns: options.columns,
          rowKey: options.rowKey,
          total: total.value,
          pageNo: pageNo.value,
          pageSize: pageSize.value,
          buttonsList: options.buttonsList,
          'onUpdate:pageNo': handleChangePage,
          'onUpdate:pageSize': handleChangeSize,
          handleRowClick,
          handleSearch,
          handleReset,
          fetchData,
          ...slotFns
        })
      }
    }
  })
}
