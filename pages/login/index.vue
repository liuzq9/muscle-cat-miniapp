<script setup lang="ts">
import { ref } from 'vue'
import { bindPhone, getMember, login } from '@/services/auth'
import type { Member } from '@/types/domain'

const loading = ref(false)
const member = ref<Member | null>(getMember())

async function handleLogin() {
  if (loading.value) return
  loading.value = true
  try {
    member.value = await login()
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 400)
  } catch {
    uni.showToast({ title: '微信登录失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

async function handlePhoneBind(event: { detail: { code?: string } }) {
  const code = event.detail.code
  if (!code || loading.value) return
  loading.value = true
  try {
    member.value = await bindPhone(code)
    uni.showToast({ title: '手机号绑定成功', icon: 'success' })
  } catch {
    uni.showToast({ title: '手机号绑定失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="page">
    <view class="panel login-card">
      <view class="brand">肌肉猫</view>
      <view class="title">登录后开始预约</view>
      <view class="muted">登录用于保存你的预约和上课记录</view>
      <button class="primary" :loading="loading" @tap="handleLogin">微信一键登录</button>
      <button
        v-if="member && !member.phoneBound"
        class="secondary"
        open-type="getPhoneNumber"
        @getphonenumber="handlePhoneBind"
      >
        绑定手机号
      </button>
      <view class="hint">登录即表示同意肌肉猫的用户服务和隐私保护指引</view>
    </view>
  </view>
</template>

<style src="./index.scss" lang="scss" scoped></style>
