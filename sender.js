import { Telegraf } from "telegraf";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: './config.env' });

const bot = new Telegraf(process.env.BOT_TOKEN);

const unsendFilePath = path.join('./', 'unsend.json');

// 生成 Markdown 格式的字符串
const markdown = (article) => {
  let url = encodeURIComponent(article.link);
  let link = article.link
  return `
*${article.title}*
[----------------](https://t.me/iv?url=${url}&rhash=3cd30abc99a51c)
[Article Link](${link})
----------------
`;
};
async function sendArticles() {
  try {
    // 读取 unsend.json 文件内容
    let unsendArticles = [];
    if (fs.existsSync(unsendFilePath)) {
      try {
        const data = fs.readFileSync(unsendFilePath, 'utf-8');
        unsendArticles = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing unsend.json:', parseError);
        unsendArticles = [];
      }
    }

    // 检查文章列表是否为空
    if (unsendArticles.length === 0) {
      console.log('no new articles');
      return;
    }

    // 倒序遍历文章列表
    for (let i = unsendArticles.length - 1; i >= 0; i--) {
      const article = unsendArticles[i];
      const message = markdown(article);

      try {
        await bot.telegram.sendMessage(process.env.CHANNEL_ID, message, { parse_mode: 'Markdown' });
        console.log(`Sent article: ${article.title}`);

        // 发送成功后，从列表中删除已发送的文章
        unsendArticles.splice(i, 1);

        // 将更新后的文章列表写回 unsend.json 文件
        fs.writeFileSync(unsendFilePath, JSON.stringify(unsendArticles, null, 2), 'utf-8');
      } catch (error) {
        console.error(`Error sending article: ${article.title}`, error);
      }

      // 每篇文章之间间隔 5 秒
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.error('Error sending articles:', error);
  }
}

export { sendArticles };