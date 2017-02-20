import fetch from '../../core/fetch';

// React.js News Feed (RSS)
const url = 'https://api.rss2json.com/v1/api.json' +
            '?rss_url=https%3A%2F%2Freactjsnews.com%2Ffeed.xml';

let items = [];
let lastFetchTask;
let lastFetchTime = new Date(1970, 0, 1);

export default async function index(req, res) {
  if (lastFetchTask) {
    return res.status(200).json(lastFetchTask);
  }

  if ((new Date() - lastFetchTime) > 1000 * 60 * 10 /* 10 mins */) {
    lastFetchTime = new Date();
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'ok') {
      items = data.items;
    }
    lastFetchTask = null;

    return res.status(200).json(items);
  }

  return res.status(200).json(items);
}
