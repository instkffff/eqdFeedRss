import { main } from './rss.js';
import { sendArticles } from './sender.js';

const MAX_RETRIES = 10; // 最大重试次数
const RETRY_DELAY = 5000; // 重试之间的延迟时间（毫秒）

setInterval(async () => {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            let articles = await main();
            if (Array.isArray(articles) && articles.length > 0) {
                sendArticles(articles);
                console.log('Articles sent successfully.');
                return; // 成功发送后退出循环
            } else {
                console.log('No new articles to send.');
                return; // 没有新文章时退出循环
            }
        } catch (error) {
            console.error(`Error in fetching or sending articles (attempt ${retries + 1}):`, error);
            retries++;
            if (retries < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            } else {
                console.error('Max retries reached. Giving up.');
            }
        }
    }
}, 1000 * 60 * 60); // 1小时