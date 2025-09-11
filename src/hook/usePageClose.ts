// composables/usePageClose.ts
import { onMounted, onBeforeUnmount, ref, Ref } from 'vue';

export interface PageCloseOptions {
  onBeforeClose?: (event: BeforeUnloadEvent) => void;
  onClose?: () => void;
  enableTimeDiff?: boolean;
}

export interface UsePageCloseReturn {
  isPageClosing: Ref<boolean>;
}

export function usePageClose(options: PageCloseOptions = {}): UsePageCloseReturn {
  const {
    onBeforeClose = null,
    onClose = null,
    enableTimeDiff = false
  } = options;
  
  const beforeUnloadTime = ref(0);
  const isPageClosing = ref(false);

  const handleBeforeUnload = (event: BeforeUnloadEvent): string | void => {
    isPageClosing.value = true;
    
    if (enableTimeDiff) {
      beforeUnloadTime.value = Date.now();
    }
    
    if (onBeforeClose) {
      return onBeforeClose(event);
    }  
  };

  const handleUnload = (): void => {
    if (onClose) {
      onClose();
    }
    
    if (enableTimeDiff) {
      const unloadTime = Date.now();
      const duration = unloadTime - beforeUnloadTime.value;
      
      if (duration < 5) {
        console.log('页面正在关闭');
      } else {
        console.log('页面正在刷新');
      }
    }
  };

  onMounted((): void => {
    window.addEventListener('beforeunload', handleBeforeUnload as EventListener);
    window.addEventListener('unload', handleUnload);
  });

  onBeforeUnmount((): void => {
    window.removeEventListener('beforeunload', handleBeforeUnload as EventListener);
    window.removeEventListener('unload', handleUnload);
  });

  return {
    isPageClosing
  };
}