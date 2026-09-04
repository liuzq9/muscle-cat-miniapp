<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/services/api'
import type { Coach } from '@/types/domain'
const coaches = ref<Coach[]>([])
onMounted(async () => {
  coaches.value = await api.coaches()
})
const open = (id: string) => uni.navigateTo({ url: `/pages/booking/index?coachId=${id}` })
</script>
<template>
  <view class="page"
    ><view class="muted intro">选择教练后查看他的课程和可预约排期</view
    ><view v-for="coach in coaches" :key="coach.id" class="panel card"
      ><view class="avatar">{{ coach.name.slice(0, 1) }}</view
      ><view class="body"
        ><view class="name">{{ coach.name }}</view
        ><view class="title">{{ coach.title }}</view
        ><view class="bio">{{ coach.bio }}</view
        ><view class="specialties">{{ coach.specialties.join('  ·  ') }}</view
        ><button class="outline" @tap="open(coach.id)">查看排期</button></view
      ></view
    ></view
  >
</template>
<style src="./index.scss" lang="scss" scoped></style>
