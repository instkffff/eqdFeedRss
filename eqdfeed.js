import { processNewArticles } from './sendlist.js';
import { sendArticles } from './sender.js';

const maxRetries = 3; // 最大重试次数
const retryInterval = 5 * 1000; // 重试间隔时间（5秒）

async function runWithRetries(func, retries) {
  for (let attempt = 0; attempt < retries + 1; attempt++) {
    try {
      await func();
      return; // 成功执行后退出
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed with error:`, error);
      if (attempt < retries) {
        console.log(`Retrying in ${retryInterval / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryInterval));
      } else {
        console.error('All retries failed.');
      }
    }
  }
}

setInterval(async () => {
  await processNewArticles();
  await runWithRetries(sendArticles, maxRetries);
}, 60 * 60 * 1000);