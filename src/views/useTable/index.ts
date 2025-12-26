import { ref, reactive } from "vue"
import type { ButtonConfig, UseTableOptions } from "./types"

export function useTable<T = any>(
  api: ((params: Record<string, any>) => Promise<any>) | ((params:Record<string, any>, config: any) => Promise<any>),
  options: UseTableOptions = {}
) {
  const searchForm = reactive<Record<string, any>>({ ...options.defaultParams })
  const tableData = ref<T[]>([])
  const total = ref(0)
  const loading = ref(false)
  const pageNo = ref(1)
  const pageSize = ref(10)
  const buttonsList = ref<ButtonConfig<T>[]>([])
  const pageField = options.pageField || "pageNo"
  const sizeField = options.sizeField || "pageSize"
  const fetchData = async () => {
    loading.value = true
    try {
      const params = {
        ...searchForm,
        [pageField]: pageNo.value,
        [sizeField]: pageSize.value
      }
      const res = await api(params, options.apiConfig || {})
      const parsed = options.parsseResponse ? options.parsseResponse(res) : res?.data ?? { list: [], total: 0 }
      tableData.value = parsed.list
      total.value = parsed.total
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }

  const handleSearch = () => {
    pageNo.value = 1
    fetchData()
  }

  const handleReset = () => {
    let keys:string[] = []
    if(options.defaultParams){
      keys = Object.keys(options.defaultParams)
    }
    Object.keys(searchForm).forEach((key) => {
      if(keys.includes(key)){
        (searchForm as any)[key] = (options.defaultParams as any)[key]
      }else{
        (searchForm as any)[key] = undefined
      }
    })
    pageNo.value = 1
    fetchData()
  }
  return {
    searchForm,
    tableData,
    total,
    loading,
    pageNo,
    pageSize,
    buttonsList,
    handleSearch,
    handleReset,
    fetchData
  }
}
