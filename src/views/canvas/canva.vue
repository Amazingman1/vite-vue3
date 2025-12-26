<template>
  <div class="image-processor">
    <div class="controls">
      <input type="file" @change="handleImageUpload" accept="image/*" />
      <button @click="reset" :disabled="!hasImage">重置</button>
      
      <div class="color-controls">
        <label>
          红色: 
          <input type="range" v-model="colorSettings.red" min="0" max="2" step="0.1" @input="processImages" />
          {{ colorSettings.red }}
        </label>
        <label>
          绿色: 
          <input type="range" v-model="colorSettings.green" min="0" max="2" step="0.1" @input="processImages" />
          {{ colorSettings.green }}
        </label>
        <label>
          蓝色: 
          <input type="range" v-model="colorSettings.blue" min="0" max="2" step="0.1" @input="processImages" />
          {{ colorSettings.blue }}
        </label>
      </div>

      <div class="blend-controls">
        <label>
          混合模式:
          <select v-model="blendMode" @change="processImages">
            <option value="multiply">multiply</option>
            <option value="overlay">overlay</option>
            <option value="screen">screen</option>
            <option value="lighten">lighten</option>
            <option value="darken">darken</option>
            <option value="hard-light">hard-light</option>
          </select>
        </label>
      </div>
    </div>

    <div class="preview-area">
      <div class="canvas-preview">
        <h3>2D 预览</h3>
        <canvas ref="canvas" width="512" height="512"></canvas>
      </div>
      
      <div class="three-preview">
        <h3>3D 预览</h3>
        <div ref="threeContainer" class="three-container"></div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">处理中...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Refs
const canvas = ref(null)
const threeContainer = ref(null)

// 状态
const loading = ref(false)
const error = ref('')
const hasImage = ref(false)
const blendMode = ref('multiply')

// 图片和场景对象
let baseImage = null
let userImage = null
let ctx = null
let scene, camera, renderer, controls, currentMesh = null

// 颜色设置
const colorSettings = reactive({
  red: 1.0,
  green: 1.0,
  blue: 1.0
})

// 图片加载函数
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      console.log('图片加载成功:', src)
      resolve(img)
    }
    img.onerror = (e) => {
      console.error('图片加载失败:', src, e)
      reject(new Error(`无法加载图片: ${src}`))
    }
    img.src = src
  })
}

// 初始化 Canvas
const initCanvas = async () => {
  if (!canvas.value) return
  
  ctx = canvas.value.getContext('2d')
  
  try {
    // 加载基础图片 - 替换为你的实际图片路径
    baseImage = await loadImage('/base-image.png')
    console.log('基础图片加载完成')
  } catch (err) {
    console.error('加载基础图片失败:', err)
    error.value = '加载基础图片失败，请检查图片路径'
    // 创建一个默认的基础图片
    createDefaultBaseImage()
  }
}

// 创建默认基础图片（备用）
const createDefaultBaseImage = () => {
  baseImage = new Image()
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const tempCtx = canvas.getContext('2d')
  
  // 创建渐变背景
  const gradient = tempCtx.createLinearGradient(0, 0, 512, 512)
  gradient.addColorStop(0, '#4facfe')
  gradient.addColorStop(1, '#00f2fe')
  tempCtx.fillStyle = gradient
  tempCtx.fillRect(0, 0, 512, 512)
  
  // 添加一些图形
  tempCtx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  tempCtx.beginPath()
  tempCtx.arc(256, 256, 100, 0, Math.PI * 2)
  tempCtx.fill()
  
  baseImage.src = canvas.toDataURL()
}

// 处理图片上传
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  loading.value = true
  error.value = ''

  try {
    const imageUrl = URL.createObjectURL(file)
    userImage = await loadImage(imageUrl)
    hasImage.value = true
    await processImages()
  } catch (err) {
    console.error('处理图片失败:', err)
    error.value = `处理图片失败: ${err.message}`
  } finally {
    loading.value = false
  }
}

// 处理图片融合
const processImages = async () => {
  if (!ctx || !baseImage || !userImage) {
    console.log('缺少必要的图片或上下文')
    return
  }

  try {
    // 确保图片已加载
    if (!baseImage.complete || !userImage.complete) {
      console.log('图片尚未完全加载')
      return
    }

    // 清空画布
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    
    // 绘制基础图片
    ctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(baseImage, 0, 0, canvas.value.width, canvas.value.height)
    
    // 设置混合模式并绘制用户图片
    // ctx.globalCompositeOperation = blendMode.value
    ctx.drawImage(userImage, 0, 0, canvas.value.width, canvas.value.height)
    
    // 应用颜色效果
    // applyColorEffects()
    
    // 更新 3D 纹理
    update3DTexture()
    
  } catch (err) {
    console.error('图片处理错误:', err)
    error.value = `图片处理错误: ${err.message}`
  }
}

// 应用颜色效果
const applyColorEffects = () => {
  const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
  const data = imageData.data
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * colorSettings.red)        // R
    data[i + 1] = Math.min(255, data[i + 1] * colorSettings.green) // G
    data[i + 2] = Math.min(255, data[i + 2] * colorSettings.blue)  // B
    // Alpha 通道保持不变
  }
  
  ctx.putImageData(imageData, 0, 0)
}

// 初始化 Three.js
const initThreeJS = () => {
  if (!threeContainer.value) return

  // 创建场景
  scene = new THREE.Scene()
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    threeContainer.value.clientWidth / threeContainer.value.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 5
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
  renderer.setClearColor(0x000000, 0)
  threeContainer.value.appendChild(renderer.domElement)
  
  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  
  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)
  
  // 创建初始几何体
  createInitialGeometry()
  
  // 开始动画循环
  animate()
}

// 创建初始几何体
const createInitialGeometry = () => {
  const geometry = new THREE.SphereGeometry(2, 32, 32)
  const material = new THREE.MeshPhongMaterial({
    color: 0x888888,
    shininess: 30
  })
  
  currentMesh = new THREE.Mesh(geometry, material)
  scene.add(currentMesh)
}

// 更新 3D 纹理
const update3DTexture = () => {
  if (!currentMesh || !canvas.value) return
  
  const texture = new THREE.CanvasTexture(canvas.value)
  texture.needsUpdate = true
  
  currentMesh.material.map = texture
  currentMesh.material.needsUpdate = true
}

// 动画循环
const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

// 重置
const reset = () => {
  colorSettings.red = 1.0
  colorSettings.green = 1.0
  colorSettings.blue = 1.0
  blendMode.value = 'multiply'
  
  if (userImage) {
    processImages()
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (!threeContainer.value || !camera || !renderer) return
  
  camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
}

// 生命周期
onMounted(async () => {
  await initCanvas()
  initThreeJS()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.dispose()
  }
  if (userImage && userImage.src.startsWith('blob:')) {
    URL.revokeObjectURL(userImage.src)
  }
})
</script>

<style scoped>
.image-processor {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.controls {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.controls label {
  display: block;
  margin: 10px 0;
}

.color-controls, .blend-controls {
  margin: 15px 0;
}

.preview-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.canvas-preview, .three-preview {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
}

.three-container {
  width: 100%;
  height: 400px;
  background: #f0f0f0;
}

.loading, .error {
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  text-align: center;
}

.loading {
  background: #e3f2fd;
  color: #1976d2;
}

.error {
  background: #ffebee;
  color: #d32f2f;
}

canvas {
  max-width: 100%;
  height: auto;
  border: 1px solid #ccc;
}
</style>