<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from '@/services/api'
import type { Coach, Course, Schedule } from '@/types/domain'
const coach = ref<Coach>()
const courses = ref<Course[]>([])
const schedules = ref<Schedule[]>([])
const bookingId = ref('')
const qrUrl = ref('')
const selectedCourse = ref('')
const selectedSlot = ref<Schedule>()
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const loading = ref(false)
const dateOptions = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d.toISOString().slice(0, 10)
  }),
)
const queryOptions = () => {
  const pages = getCurrentPages()
  return (pages[pages.length - 1] as any)?.options || {}
}
async function load() {
  const options = queryOptions()
  const id = options.coachId || 'coach-m1'
  bookingId.value = options.bookingId || ''
  selectedDate.value = options.date || selectedDate.value
  coach.value = await api.coach(id)
  courses.value = await api.courses(id)
  selectedCourse.value ||= options.courseId || courses.value[0]?.id || ''
  schedules.value = await api.schedules(id, selectedDate.value)
  selectedSlot.value = undefined
}
onMounted(load)
async function changeDate(date: string) {
  selectedDate.value = date
  schedules.value = await api.schedules(coach.value!.id, date)
  selectedSlot.value = undefined
}
async function submit() {
  if (!selectedSlot.value || !selectedCourse.value || loading.value)
    return uni.showToast({ title: '请选择课程和时间', icon: 'none' })
  loading.value = true
  try {
    const payload = {
      coachId: coach.value!.id,
      courseId: selectedCourse.value,
      date: selectedSlot.value.date,
      startTime: selectedSlot.value.startTime,
      endTime: selectedSlot.value.endTime,
    }
    const booking = bookingId.value
      ? await api.rescheduleBooking(bookingId.value, payload)
      : await api.createBooking({ memberId: 'demo-member', ...payload })
    if (!bookingId.value) qrUrl.value = await api.bookingQr(booking.id)
    uni.showModal({
      title: bookingId.value ? '改期成功' : '预约成功',
      content: bookingId.value
        ? '新的时间已保存。'
        : `预约码：${booking.qrToken}\n请在“我的课程”中查看二维码并到店核销。`,
      showCancel: false,
    })
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <view class="page"
    ><view class="panel coach"
      ><view class="avatar">{{ coach?.name?.slice(0, 1) }}</view
      ><view
        ><view class="name">{{ coach?.name }}</view
        ><view class="muted">{{ coach?.title }}</view></view
      ></view
    ><view class="label">选择课程</view
    ><scroll-view scroll-x class="course-scroll"
      ><view
        v-for="course in courses"
        :key="course.id"
        class="course"
        :class="{ active: selectedCourse === course.id }"
        @tap="selectedCourse = course.id"
        >{{ course.name }}</view
      ></scroll-view
    ><view class="label">选择日期</view
    ><scroll-view scroll-x class="date-scroll"
      ><view
        v-for="date in dateOptions"
        :key="date"
        class="date"
        :class="{ active: selectedDate === date }"
        @tap="changeDate(date)"
        >{{ date.slice(5).replace('-', '/') }}</view
      ></scroll-view
    ><view class="label">可预约时间 <text class="muted">每节 1 小时 · 07:00-20:00</text></view
    ><view class="grid"
      ><view
        v-for="slot in schedules"
        :key="slot.id"
        class="slot"
        :class="[`slot--${slot.status}`, { selected: selectedSlot?.id === slot.id }]"
        @tap="slot.status === 'available' && (selectedSlot = slot)"
        >{{ slot.startTime
        }}<text>{{
          slot.status === 'booked' ? '已约' : slot.status === 'available' ? '可约' : '关闭'
        }}</text></view
      ></view
    ><button class="primary" :loading="loading" @tap="submit">
      {{ bookingId ? '确认改期' : '确认预约' }}</button
    ><image v-if="qrUrl" class="qr" :src="qrUrl" mode="widthFix" /><view class="hint"
      >课程开始前 12 小时内不可自行取消或改期</view
    ></view
  >
</template>
<style src="./index.scss" lang="scss" scoped></style>
