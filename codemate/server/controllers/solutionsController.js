import axios from 'axios';

export const getSolutionVideos = async(req,res) =>{
    const API_KEY= process.env.YT_API_KEY;
    const searches = [
        'Codeforces contest solutions',
        'Leetcode contest solutions',
        'Leetcode Daily Challenge'
    ];

    try{
        const allVideos = [];
        for(const q of searches){
            const yt = await axios.get('https://www.googleapis.com/youtube/v3/search',{
                params:{ q, key: API_KEY, part: 'snippet', maxResults: 8, order: 'date', type: 'video'}
            });
            allVideos.push(...yt.data.items.map(i=>({
                id: i.id.videoId,
                title: i.snippet.title,
                url: `https://www.youtube.com/watch?v=${i.id.videoId}`,
                publishedAt: i.snippet.publishedAt
            })));
        }
        allVideos.sort((a,b)=> new Date(b.publishedAt) - new Date(a.publishedAt));
        res.json(allVideos)
    }catch(err){
        console.log(err);
        res.status(500).json({error:'YT fetch failed'});
    }
};