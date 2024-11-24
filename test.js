import { processNewArticles } from './sendlist.js';
import { sendArticles } from './sender.js';

await processNewArticles();
await sendArticles();