# eqdFeedRss

## 项目描述

本项目是一个RSS源解析器，用于特定来源（例如Equestria Daily）。它会获取、解析并处理新的文章，并将文章ID存储在本地以避免重复发送。该项目还包括将新文章发送到Telegram频道的功能。

## 安装

要安装所需的依赖项，请运行以下命令：

```sh
npm install
```

## 配置

- 建立telegram频道、telegram机器人。
- 获取CHANNEL_ID、BOT_TOKEN并填写到config.env中。

## 使用

要启动机器人，请运行：

```sh
node eqdfeed.js
```

此命令将开始定期获取和处理新文章。

## 项目结构

- defaultLocalArticleIds.js: 包含读取和更新本地文章ID的函数。
- eqdfeed.js: 项目的主入口点，协调获取、处理和发送文章的整个过程。
- localArticleIds.json: 存储已处理文章ID的JSON文件。
- package-lock.json和package.json: npm包管理文件。
- rss.js: 包含获取和解析RSS源的逻辑。
- sender.js: 负责将文章发送到Telegram频道。
- sendlist.js: 管理待发送文章列表。
- test.js: 手动测试项目功能的测试文件。
- unsend.json: 存储待发送文章列表的JSON文件。

## 贡献

欢迎贡献！ 请随时提交pull请求或打开issue以提出改进建议或报告问题。

## 许可证

本项目根据ISC许可证进行许可。详细信息请参阅LICENSE文件。
