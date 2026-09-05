# 肌肉猫小程序第一版需求文档

## 1. 项目定位

肌肉猫是一家位于南京的健身工作室。小程序服务对象为会员，帮助会员了解工作室和教练、选择私教课程和时间、管理预约，并在到店后完成签到和课程核销。教练/管理员只需要一个轻量的扫码核销入口。

第一版优先验证预约闭环，使用手机号/微信身份和角色权限的完整体系、支付、营销和管理后台不在本次前端范围内。

## 2. 用户与主流程

### 会员

1. 在首页阅读工作室介绍，查看地址、营业时间和教练入口。
2. 进入教练列表，查看教练的职称、简介、擅长方向和课程。
3. 选择教练、课程、未来 7 天中的日期和可用整点时段。
4. 确认预约，获得预约记录和预约码；后端模式下可获取二维码。
5. 在“我的课程”查看待上预约，可在规则允许时取消或改期。
6. 到店出示二维码，由教练/管理员扫码签到并在课程结束后扫码完成。
7. 在“已上课记录”查看已经完成核销的课程。

### 教练/管理员

1. 打开扫码核销页。
2. 扫描会员预约二维码执行“签到”或“完成课程”。
3. 看到成功或失败反馈；核销结果写入后端记录。

## 3. 页面与功能需求

### 3.1 首页 `/pages/index/index`

- 展示品牌名“肌肉猫”、一句品牌文案和“预约私教课”主入口。
- 展示成立故事、南京地址、营业时间和教练摘要列表。
- 点击教练摘要进入该教练的预约页。
- 数据加载失败时页面不能白屏，应保留基础品牌信息并提示错误。

### 3.2 教练列表 `/pages/coaches/coaches`

- 展示每位教练的姓名、职称、简介、擅长方向和头像占位。
- 点击“查看排期”进入预约页并带上 `coachId`。
- 第一版至少提供 3 位教练及其关联课程。

### 3.3 预约页 `/pages/booking/booking`

- 支持通过 `coachId` 进入新预约，通过 `bookingId` 进入改期。
- 课程只能选择当前教练可教授的课程；课程时长第一版固定 60 分钟。
- 日期提供今天起连续 7 天，格式为 `YYYY-MM-DD`。
- 每天生成 07:00-20:00 的 13 个整点开始时段，每个时段结束时间为开始时间后一小时。
- `available` 可选，`booked` 和 `blocked` 必须置灰且不可提交。
- 未选择课程或时间时，点击提交应提示“请选择课程和时间”，不能发起请求。
- 创建预约调用 `POST /api/bookings`；改期调用 `PATCH /api/bookings/:id/reschedule`。
- 创建成功显示预约码；真实 API 模式下请求 `GET /api/bookings/:id/qr` 并展示二维码。
- 课程开始前 12 小时内禁止取消和改期，服务端必须再次校验。

### 3.4 我的课程 `/pages/mine/mine`

- 使用 tab 切换“我的预约”和“已上课记录”。
- 预约列表展示日期、起止时间、教练、课程和状态。
- `booked` 状态提供“改期”“取消预约”；其他状态不显示这两个操作。
- 取消前二次确认，调用 `PATCH /api/bookings/:id/cancel`。
- 空列表展示可理解的空状态文案。
- 已完成记录展示日期、时间、教练和课程。

### 3.5 扫码核销 `/pages/checkin/checkin`

- 使用微信扫码能力，仅允许从摄像头扫码。
- 提供“扫码签到”和“扫码完成课程”两个动作。
- 调用 `POST /api/attendance/verify`，请求包含 `qrToken`、`action` 和核销人标识。
- 成功、扫码失败、二维码无效等情况均需 Toast 反馈，避免重复提交。

## 4. 数据模型

前端领域类型位于 `types/domain.ts`，字段约定如下：

| 对象             | 关键字段                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------- |
| StudioInfo       | `name`, `story`, `address`, `hours`, `phone`, `logoUrl`                                      |
| Coach            | `id`, `name`, `gender`, `title`, `bio`, `specialties`, `avatarUrl`, `courseIds`              |
| Course           | `id`, `name`, `durationMinutes`, `description`, `coachIds`                                   |
| Schedule         | `id`, `coachId`, `date`, `startTime`, `endTime`, `status`, `bookingId?`                      |
| Booking          | `id`, `memberId`, `coachId`, `courseId`, `date`, `startTime`, `endTime`, `status`, `qrToken` |
| AttendanceRecord | Booking 字段，以及 `checkedInAt?`, `completedAt?`, `verifiedBy?`                             |

时间段状态：`available`、`booked`、`blocked`、`completed`。预约状态：`booked`、`checked_in`、`completed`、`cancelled`。

## 5. API 契约

真实 API 基础地址由 `VITE_API_BASE_URL` 提供，默认 `http://localhost:3000/api`。前端适配层必须保持以下路径：

所有成功响应统一为 `{ code: 0, message: 'success', data }`；HTTP 或业务异常统一为 `{ code, message, data: null }`。前端 `services/http/client.ts` 会自动解包成功响应中的 `data`，并将异常转换为 `ApiError`。

```text
GET    /studio
GET    /coaches
GET    /coaches/:id
GET    /coaches/:id/schedules?date=YYYY-MM-DD
GET    /courses?coachId=:coachId
POST   /bookings
GET    /bookings?memberId=:memberId
GET    /bookings/:id/qr
PATCH  /bookings/:id/cancel
PATCH  /bookings/:id/reschedule
POST   /attendance/verify
GET    /attendance/history?memberId=:memberId
```

预约创建请求至少包含 `memberId`、`coachId`、`courseId`、`date`、`startTime`、`endTime`。核销请求至少包含 `qrToken`、`action`（`check_in` 或 `complete`）和 `verifiedBy`。冲突、过期和权限错误应返回非 2xx 状态及可展示的 `message`。

## 6. Mock 与环境

- `VITE_USE_MOCK` 缺省或为 `true` 时使用本地 mock，不依赖后端即可预览页面。
- mock 至少覆盖工作室、3 位教练、课程和排期；排期应包含可约与已约状态。
- `VITE_USE_MOCK=false` 时所有数据通过 `services/http/` 和 `services/api/` 请求后端；`services/api.ts` 仅作为现有页面的兼容出口。
- mock 模式下预约、取消、改期和扫码核销可以返回演示结果；列表数据为空属于当前已知限制，不应误认为后端已持久化。

## 7. 非功能要求

- 微信小程序端优先，H5 仅用于辅助预览。
- 页面在请求中、空数据和失败时都要有稳定布局，不因动态文案导致明显跳动或溢出。
- 预约提交需防重复点击；服务端负责最终的时间段唯一性和 12 小时规则校验。
- 不在前端保存密码、数据库连接串或管理员密钥；敏感身份和权限由后端处理。
- 图片当前允许使用文字头像和 mock 路径，后续再替换真实 Logo 和教练照片。

## 8. 第一版验收清单

- [ ] 首页能看到工作室介绍和教练入口。
- [ ] 能查看至少 3 位教练及其课程。
- [ ] 能切换未来 7 天并看到 07:00-20:00 整点排期。
- [ ] 已约时段置灰且不可提交，未选完整信息时有提示。
- [ ] 新预约、预约码/二维码展示流程可用。
- [ ] 我的预约支持查看、取消和改期，12 小时限制有反馈。
- [ ] 已完成课程能显示在上课记录中。
- [ ] 扫码签到和完成课程有成功/失败反馈。
- [ ] mock 模式可独立预览，API 模式路径与契约一致。
- [ ] `npm run build:mp-weixin` 成功并生成包含 `app.json` 的编译目录。

## 9. 后续明确不属于第一版

微信登录和手机号绑定、会员等级与余额、在线支付、优惠券、消息订阅、教练排班管理、管理员后台、真实图片上传、数据统计和多门店支持应单独立项，不应在没有需求确认时混入第一版。
