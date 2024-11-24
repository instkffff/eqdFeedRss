import { main } from './rss.js';
import fs from 'fs';
import path from 'path';

const unsendFilePath = path.join('./', 'unsend.json');

async function processNewArticles() {
  try {
    // 调用 main 函数获取新增文章列表
    const newArticles = await main();

    // 检查是否有新文章
    if (newArticles === 0) {
      console.log('no new article need write to list');
    } else {
      // 将新增文章列表写入 unsend.json 文件
      writeUnsendArticles(newArticles);
    }
  } catch (error) {
    console.error('Error processing new articles:', error);
  }
}

function writeUnsendArticles(articles) {
  try {
    // 读取现有的 unsend.json 文件内容
    let unsendArticles = [];
    if (fs.existsSync(unsendFilePath)) {
      try {
        const data = fs.readFileSync(unsendFilePath, 'utf-8');
        unsendArticles = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing unsend.json:', parseError);
        // 如果解析失败，创建一个新的空数组
        unsendArticles = [];
      }
    }

    // 合并新的文章列表
    unsendArticles = [...unsendArticles, ...articles];

    // 将更新后的数组写回文件
    fs.writeFileSync(unsendFilePath, JSON.stringify(unsendArticles, null, 2), 'utf-8');
    console.log('New articles written to unsend.json');
  } catch (error) {
    console.error('Error writing unsend articles to unsend.json', error);
  }
}

export { processNewArticles };