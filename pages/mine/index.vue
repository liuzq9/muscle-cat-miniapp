<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/services/api'
import type { AttendanceRecord, Booking } from '@/types/domain'
const bookings = ref<Booking[]>([])
const history = ref<AttendanceRecord[]>([])
const activeTab = ref<'upcoming' | 'history'>('upcoming')
onMounted(async () => {
  ;[bookings.value, history.value] = await Promise.all([api.bookings(), api.history()])
})
const cancel = async (booking: Booking) => {
  const result = await new Promise<boolean>((resolve) =>
    uni.showModal({
      title: '取消预约',
      content: '确认取消这节课吗？需满足课前 12 小时规则。',
      success: (r) => resolve(r.confirm),
    }),
  )
  if (result) {
    await api.cancelBooking(booking.id)
    booking.status = 'cancelled'
    uni.showToast({ title: '已取消', icon: 'success' })
  }
}
const reschedule = (booking: Booking) =>
  uni.navigateTo({
    url: `/pages/booking/index?bookingId=${booking.id}&coachId=${booking.coachId}&courseId=${booking.courseId}&date=${booking.date}`,
  })
</script>
<template>
  <view class="page"
    ><view class="profile panel"
      ><view class="avatar">会</view
      ><view
        ><view class="name">肌肉猫会员</view><view class="muted">保持节奏，持续进步</view></view
      ></view
    ><view class="tabs"
      ><view :class="{ active: activeTab === 'upcoming' }" @tap="activeTab = 'upcoming'"
        >我的预约</view
      ><view :class="{ active: activeTab === 'history' }" @tap="activeTab = 'history'"
        >已上课记录</view
      ></view
    ><view v-if="activeTab === 'upcoming'"
      ><view v-if="!bookings.length" class="empty">暂时没有预约，去选择一位教练吧</view
      ><view v-for="booking in bookings" :key="booking.id" class="panel record"
        ><view class="record-head"
          ><view>{{ booking.date }} {{ booking.startTime }}-{{ booking.endTime }}</view
          ><view class="status">{{ booking.status }}</view></view
        ><view class="muted">教练：{{ booking.coachId }} · 课程：{{ booking.courseId }}</view
        ><view class="actions"
          ><button v-if="booking.status === 'booked'" class="cancel" @tap="reschedule(booking)">
            改期</button
          ><button v-if="booking.status === 'booked'" class="cancel" @tap="cancel(booking)">
            取消预约
          </button></view
        ></view
      ></view
    ><view v-else
      ><view v-if="!history.length" class="empty">完成核销后的课程会显示在这里</view
      ><view v-for="item in history" :key="item.id" class="panel record"
        ><view class="record-head"
          ><view>{{ item.date }} {{ item.startTime }}-{{ item.endTime }}</view
          ><view class="done">已完成</view></view
        ><view class="muted">教练：{{ item.coachId }} · 课程：{{ item.courseId }}</view></view
      ></view
    ></view
  >
</template>
<style src="./index.scss" lang="scss" scoped></style>
