export interface TreeType {
  labelZn: string;
  dataType: string;
  isRequired: boolean | string;
  labelEn: string;
  remark?: string;
  children?: TreeType[];
}
