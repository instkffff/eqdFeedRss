import { Telegraf } from "telegraf";
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const bot = new Telegraf(process.env.BOT_TOKEN);

// 生成 Markdown 格式的字符串
const markdown = (article) => {
  return `
*${article.title}*
[-------------------------------](${article.image})
[Article Link](${article.link})
`;
};

function sendArticles(articles) {
  // 反转数组
  articles = articles.reverse();

  articles.forEach(article => {
    const message = markdown(article);
    bot.telegram.sendMessage(process.env.CHANNEL_ID, message, { parse_mode: 'Markdown' })
      .then(() => {
        console.log(`Sent article: ${article.title}`);
      })
      .catch((error) => {
        console.error(`Error sending article: ${article.title}`, error);
      });
  });
}

export { sendArticles };