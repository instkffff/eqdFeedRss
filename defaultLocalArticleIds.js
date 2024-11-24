import request from 'request';
import FeedParser from 'feedparser';
import fs from 'fs-extra';
import path from 'path';

const rssUrl = 'https://www.equestriadaily.com/feeds/posts/default'; // 替换为你要解析的RSS订阅源URL
const localFilePath = path.join('./', 'localArticleIds.json');

// 读取本地存储的文章 ID 列表
async function readLocalArticleIds() {
  try {
    const data = await fs.readJSON(localFilePath);
    return data.articleIds || [];
  } catch (error) {
    return [];
  }
}

// 更新本地存储的文章 ID 列表
async function updateLocalArticleIds(articleIds) {
  await fs.writeJSON(localFilePath, { articleIds });
}

// 解析 RSS 或 Atom 订阅源并提取文章信息
function parseRSS() {
  return new Promise((resolve, reject) => {
    const articles = [];
    const parser = new FeedParser();

    request(rssUrl)
      .pipe(parser)
      .on('error', (error) => {
        reject(error);
      })
      .on('meta', (meta) => {
        console.log(`Feed Title: ${meta.title}`);
        console.log(`Feed Description: ${meta.description}`);
      })
      .on('readable', function() {  // 使用普通函数
        let item;
        while (item = this.read()) {
          // 假设每篇文章的 ID 是 guid 属性，如果是 Atom 格式，则使用 id 属性
          const articleId = item.guid || item.id;
          if (articleId) {
            articles.push(articleId);
          }
        }
      })
      .on('end', () => {
        resolve(articles);
      });
  });
}

// 主函数
async function main() {
  try {
    const allArticleIds = await parseRSS();
    const existingArticleIds = await readLocalArticleIds();
    const uniqueArticleIds = Array.from(new Set([...allArticleIds, ...existingArticleIds]));
    await updateLocalArticleIds(uniqueArticleIds);
    console.log('所有文章 ID 已成功写入 localArticleIds.json');
  } catch (error) {
    console.error('发生错误:', error);
  }
}

main();