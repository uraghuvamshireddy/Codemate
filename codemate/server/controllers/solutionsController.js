import axios from 'axios';

export const getSolutionVideos = async (req, res) => {
  const API_KEY = process.env.YT_API_KEY;

  const searches = [
    { query: 'Codeforces contest solutions', platform: 'codeforces' },
    { query: 'Leetcode contest solutions', platform: 'leetcode' },
    { query: 'Leetcode Daily Challenge', platform: 'leetcode' }
  ];

  try {
    const allVideos = [];

    for (const { query, platform } of searches) {
      const ytRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          q: query,
          key: API_KEY,
          part: 'snippet',
          maxResults: 8,
          order: 'date',
          type: 'video'
        }
      });

      const mapped = ytRes.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        platform,
        publishedAt: item.snippet.publishedAt
      }));

      allVideos.push(...mapped);
    }

    allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.json({ videos: allVideos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
};
