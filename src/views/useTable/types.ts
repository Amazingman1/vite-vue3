export interface ButtonConfig<T = any> {
  text: string
  attrs: any
  show?: boolean | ((row: T) => boolean)
  icon?: string
  onClick: (row: T) => void
}

export interface TableConfig<T = any> {
  label: string
  prop: string
  type?: "index" | "selection" | "expand" | "default"
  showTooltip?: boolean
  slot?: string
  attrs: any
  buttons?: ButtonConfig<T>[] | ((row: T) => ButtonConfig<T>[])
  render?: (row: T) => any
}
export enum InputType {
  "input" = "input",
  "select" = "select",
  "radio" = "radio",
  "checkbox" = "checkbox",
  "date" = "date",
  "daterange" = "daterange",
  "time" = "time",
  "timerange" = "timerange",
  "switch" = "switch"
}
export interface FormConfig<T = any> {
  label: string
  prop: string
  type: InputType
  attrs: any
  formatter?: (row: T, column: TableConfig<T>, cellValue: any, index: number) => string
  render?: (row: T) => any
  onChange?: (from: any, value: any) => void
}

export interface TableOptions<T = any> {
  api: ((params: Record<string, any>) => Promise<any>) | ((params:Record<string, any>, config: any) => Promise<any>)
  searchConfig: FormConfig<T>[]
  columns: TableConfig<T>[]
  defaultParams?: Record<string, any>
  apiConfig?: any
  rowKey?: string
  pageField?: string
  sizeField?: string
  buttonsList?: ButtonConfig<T>[]
  onRowClick?: (row: T, column: TableConfig<T>, event: Event) => void
  parseResponse?: (res: any) => { list: T[]; total: number }
}

export interface UseTableOptions<T = any> {
  defaultParams?: Record<string, any>
  parsseResponse?: (res: any) => { list: T[]; total: number }
  apiConfig?: any
  pageField?: string
  sizeField?: string
  buttonsList?: ButtonConfig<T>[]
}
