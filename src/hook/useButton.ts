import { defineComponent, h, computed, ref } from 'vue';
import ButtonGroup from '@/components/ButtonGroup/index.vue'
// 类型定义
export type UserStatus = 'editable' | 'non-editable';
export type DataStatus = 'official' | 'draft' | 'gray';
export type ButtonType = 'export' | 'history' | 'test' | 'publish' | 'edit' | 'exit-edit';

export interface ButtonConfig {
  type: ButtonType;
  label: string;
  onClick: () => void;
  visible: boolean;
}

export interface ButtonGroupProps {
  userStatus: UserStatus;
  dataStatus: DataStatus;
  editingUser?: string; // 当用户不可编辑时，显示谁正在编辑
}

// 高阶组件
export const withButtonGroupPermission = () => {
  return defineComponent({
    name: 'ButtonGroupWithPermission',
    props: {
      userStatus: {
        type: String as () => UserStatus,
        required: true,
        default: 'non-editable'
      },
      dataStatus: {
        type: String as () => DataStatus,
        required: true,
        default: 'official'
      },
      editingUser: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      const isEditing = ref(false);
      
      // 切换编辑状态
      const toggleEdit = () => {
        isEditing.value = !isEditing.value;
      };
      
      // 计算按钮可见性
      const buttonVisibility = computed(() => {
        const { userStatus, dataStatus } = props;
        const buttons: Record<ButtonType, boolean> = {
          'export': false,
          'history': false,
          'test': false,
          'publish': false,
          'edit': false,
          'exit-edit': false
        };
        
        // 用户不可编辑时
        if (userStatus === 'non-editable') {
          return buttons; // 所有按钮隐藏
        }
        
        // 用户可编辑时
        if (isEditing.value) {
          // 编辑状态下显示的按钮
          buttons['export'] = true;
          buttons['history'] = true;
          buttons['test'] = true;
          buttons['publish'] = true;
          buttons['exit-edit'] = true;
        } else {
          // 非编辑状态下
          buttons['export'] = true;
          buttons['history'] = true;
          
          if (dataStatus === 'official') {
            // 正式数据只显示导出和历史记录
          } else if (dataStatus === 'draft' || dataStatus === 'gray') {
            // 草稿和灰度数据显示编辑按钮
            buttons['edit'] = true;
          }
        }
        
        return buttons;
      });
      
      // 按钮配置
      const buttonConfigs = computed<ButtonConfig[]>(() => [
        {
          type: 'export',
          label: '导出',
          onClick: () => console.log('导出操作'),
          visible: buttonVisibility.value.export
        },
        {
          type: 'history',
          label: '历史记录',
          onClick: () => console.log('历史记录操作'),
          visible: buttonVisibility.value.history
        },
        {
          type: 'test',
          label: '测试',
          onClick: () => console.log('测试操作'),
          visible: buttonVisibility.value.test
        },
        {
          type: 'publish',
          label: '发布',
          onClick: () => console.log('发布操作'),
          visible: buttonVisibility.value.publish
        },
        {
          type: 'edit',
          label: '编辑',
          onClick: toggleEdit,
          visible: buttonVisibility.value.edit
        },
        {
          type: 'exit-edit',
          label: '退出编辑',
          onClick: toggleEdit,
          visible: buttonVisibility.value['exit-edit']
        }
      ]);
      
      // 是否显示编辑提示
      const showEditingTip = computed(() => {
        return props.userStatus === 'non-editable' && props.editingUser;
      });
      
      return () => {
        return h(ButtonGroup,{
          isEditing,
          buttonConfigs,
          showEditingTip,
          toggleEdit,
          editingUser:props.editingUser,
          buttons: buttonConfigs.value.filter(btn => btn.visible),
        });
      }
    }
  });
};

// 使用高阶组件封装后的按钮组
export const PermissionButtonGroup = withButtonGroupPermission();