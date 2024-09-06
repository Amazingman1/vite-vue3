<!--
 * @Author: wangxuan wangxuan
 * @Date: 2024-08-19 13:17:10
 * @LastEditors: wangxuan wangxuan
 * @LastEditTime: 2024-08-19 16:17:44
 * @FilePath: /vite-vue3/src/components/HelloWorld.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="wraps">
       <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign" style="max-width: 460px">
            <el-form-item label="账号">
                 <el-input v-model="formLabelAlign.name" />
            </el-form-item>
            <el-form-item label="密码">
                 <el-input type="password" v-model="formLabelAlign.password" />
            </el-form-item>
            <el-form-item label="验证码">
                 <div style="display:flex">
                      <el-input  v-model="formLabelAlign.code" />
                      <img @click="resetCode" :src="codeUrl" alt="">
                 </div>
            </el-form-item>
            <el-form-item>
                 <el-button @click="submit">登录</el-button>
            </el-form-item>
       </el-form>
  </div>
</template>
  
<script setup lang='ts'>
import { reactive, ref } from 'vue';

const codeUrl = ref<string>('/api/v1/user/code')

const resetCode = () => codeUrl.value = codeUrl.value + '?' + Math.random()

const labelPosition = ref<string>('right')

const formLabelAlign = reactive({
  name: "",
  password: "",
  code: ""
})

const submit = async () => {
  await fetch('/api/v1/user/login', {
       method: "POST",
       body: JSON.stringify(formLabelAlign),
       headers: {
            'content-type': 'application/json'
       }
  }).then(res => res.json())
}



</script>
  
<style>
* {
  padding: 0;
  margin: 0;
}

.wraps {
  display: flex;
  justify-content: center;
  align-items: center;
  height: inherit;
}

html,
body,
#app {
  height: 100%;
}
</style>