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
            const article = {
              id: articleId,
              title: item.title || '',  // 提取文章标题
              link: item.link || '',
              image: '',  // 初始化为空字符串
            };

            // 提取 summary 中的 <a> 标签链接
            const aLinks = extractALinks(item.description);
            if (aLinks.length > 0) {
              article.image = aLinks[0];  // 取第一个 <a> 标签链接作为文章的图片
            }

            articles.push(article);
          }
        }
      })
      .on('end', () => {
        resolve(articles);
      });
  });
}

// 提取 summary 中的 <a> 标签链接
function extractALinks(summary) {
  const regex = /<a[^>]+href="([^"]+)"/g;
  const links = [];
  let match;
  while ((match = regex.exec(summary)) !== null) {
    links.push(match[1]);
  }
  return links;
}

// 对比新旧文章信息列表
async function compareAndReturnNewArticles(newArticles) {
  const localArticleIds = await readLocalArticleIds();
  const newArticlesInfo = newArticles.filter(article => !localArticleIds.includes(article.id));
  if (newArticlesInfo.length > 0) {
    const newArticleIds = newArticles.map(article => article.id);
    await updateLocalArticleIds(newArticleIds);
  }
  return newArticlesInfo;
}

// 主函数
async function main() {
  try {
    const newArticles = await parseRSS();
    const newArticlesInfo = await compareAndReturnNewArticles(newArticles);
    if (newArticlesInfo.length > 0) {
      console.log('新增的文章信息列表:', newArticlesInfo);
      return newArticlesInfo;
    } else {
      console.log('没有新增的文章');
      return 0;
    }
  } catch (error) {
    console.error('发生错误:', error);
  }
}

export default main;