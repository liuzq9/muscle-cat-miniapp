# 肌肉猫小程序前端

技术栈：uni-app、Vue 3、TypeScript、Vite、SCSS。

## 开发

```bash
npm install
npm run dev:mp-weixin
```

编译成功后，将 `dist/dev/mp-weixin` 目录导入微信开发者工具，不要导入本源码目录。复制 `.env.example` 为 `.env`，将 `VITE_USE_MOCK=false` 后连接后端 API。

如果微信开发者工具提示 `app.json: 在项目根目录未找到 app.json`，说明导入目录不正确：微信工具只能打开编译后的 `dist/dev/mp-weixin`，源码根目录下的 Vue/TS 文件不能直接运行。

当前页面包含工作室介绍、教练展示、课程选择、07:00-20:00 整点排期、已预约置灰、预约确认、我的预约和上课记录入口。图片暂以文字头像和 mock 路径代替，后续可替换为真实 Logo/教练照片。
