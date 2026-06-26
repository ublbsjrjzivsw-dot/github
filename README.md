# 情绪交互治愈网站

这是整理好的可分享源码版本，不包含 `node_modules`、缓存、QA 截图和构建产物。

## 运行方式

1. 安装 Node.js。
2. 在本文件夹打开终端。
3. 安装依赖：

```powershell
npm install
```

4. 启动网页：

```powershell
npm run dev
```

5. 浏览器打开：

```text
http://127.0.0.1:5173/?phase=night
```

也可以打开早上版本：

```text
http://127.0.0.1:5173/?phase=morning
```

## 打包成网页文件

```powershell
npm run build
```

打包结果会生成在 `dist` 文件夹里。

## 发布到 GitHub Pages

这个项目已经带好 GitHub Pages 自动部署配置。

1. 在 GitHub 新建一个空仓库，例如 `healing-mood-site`。
2. 把本项目推送到这个仓库的 `main` 分支。
3. 打开仓库的 `Settings` -> `Pages`。
4. `Source` 选择 `GitHub Actions`。
5. 等 `Actions` 里的部署完成。
6. 公开网址通常是：

```text
https://你的GitHub用户名.github.io/仓库名/
```

例如仓库名是 `healing-mood-site`，网址类似：

```text
https://你的GitHub用户名.github.io/healing-mood-site/
```
