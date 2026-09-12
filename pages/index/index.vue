<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/services/api'
import type { Coach, StudioInfo } from '@/types/domain'
import heroFitnessUrl from '@/assets/hero-fitness.png'

const studio = ref<StudioInfo>()
const coaches = ref<Coach[]>([])
onMounted(async () => {
  ;[studio.value, coaches.value] = await Promise.all([api.studio(), api.coaches()])
})
const go = (url: string) => uni.navigateTo({ url })
</script>

<template>
  <view class="page">
    <view class="hero">
      <image class="hero-bg" :src="heroFitnessUrl" mode="aspectFill" />
      <view class="eyebrow">NANJING · PRIVATE TRAINING</view>
      <view class="brand">{{ studio?.name || '肌肉猫' }}</view>
      <view class="hero-copy">把每一次训练，变成更了解自己的证据。</view>
      <button class="primary" @tap="go('/pages/coaches/index')">预约私教课</button>
    </view>
    <view class="panel intro">
      <view class="section-title">关于肌肉猫</view>
      <view class="story">{{ studio?.story }}</view>
      <view class="meta">{{ studio?.address }} · {{ studio?.hours }}</view>
    </view>
    <view class="section-title coach-heading">三位教练，各有特点</view>
    <view class="section-title coach-heading">教练信息</view>
    <view
      v-for="coach in coaches"
      :key="coach.id"
      class="panel coach-row"
      @tap="go(`/pages/booking/index?coachId=${coach.id}`)"
    >
      <view class="avatar">{{ coach.name.slice(0, 1) }}</view>
      <view class="coach-info"
        ><view class="coach-name">{{ coach.name }}</view
        ><view class="muted">{{ coach.title }}</view
        ><view class="tags">{{ coach.specialties.join(' · ') }}</view></view
      >
      <text class="arrow">›</text>
    </view>
  </view>
</template>

<style src="./index.scss" lang="scss" scoped></style>
