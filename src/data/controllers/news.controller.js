import fetch from '../../core/fetch';

// React.js News Feed (RSS)
const url = 'http://ajax.googleapis.com/ajax/services/feed/load' +
            '?v=1.0&num=10&q=https://reactjsnews.com/feed.xml';

let items = [];
let lastFetchTask;
let lastFetchTime = new Date(1970, 0, 1);

export default function index(req, res) {
  if (lastFetchTask) {
    return res.status(200).json(lastFetchTask);
  }

  if ((new Date() - lastFetchTime) > 1000 * 60 * 10 /* 10 mins */) {
    lastFetchTime = new Date();
    lastFetchTask = fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.responseStatus === 200) {
          items = data.responseData.feed.entries;
        }

        if (items.length) {
          return res.status(200).json(items);
        }
        return res.status(200).json(lastFetchTask);
      })
      .finally(() => {
        lastFetchTask = null;
      });

    return null;
  }

  return res.status(200).json(items);
}
