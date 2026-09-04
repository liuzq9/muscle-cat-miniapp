<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/services/api'
const lastToken = ref('')
const working = ref(false)
async function scan(action: 'check_in' | 'complete') {
  if (working.value) return
  working.value = true
  try {
    const result = await new Promise<string>((resolve, reject) =>
      uni.scanCode({ onlyFromCamera: true, success: (item) => resolve(item.result), fail: reject }),
    )
    lastToken.value = result
    await api.verifyAttendance(result, action)
    uni.showToast({ title: action === 'check_in' ? '签到成功' : '课程已完成', icon: 'success' })
  } catch {
    uni.showToast({ title: '扫码或核销失败', icon: 'none' })
  } finally {
    working.value = false
  }
}
</script>
<template>
  <view class="page"
    ><view class="panel intro"
      ><view class="title">课程核销</view
      ><view class="muted">请使用教练或管理员账号扫描会员预约二维码</view></view
    ><button class="primary" @tap="scan('check_in')">扫码签到</button
    ><button class="secondary" @tap="scan('complete')">扫码完成课程</button
    ><view v-if="lastToken" class="panel result"
      ><view class="muted">最近核销码</view><view class="token">{{ lastToken }}</view></view
    ></view
  >
</template>
<style src="./index.scss" lang="scss" scoped></style>
