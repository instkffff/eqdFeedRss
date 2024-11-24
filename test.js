import { main } from './rss.js';
import { sendArticles } from './sender.js';

main().then(articles => {
    sendArticles(articles);
});