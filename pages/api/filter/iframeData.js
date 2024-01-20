const topTracks = async (query) => {
    const current = await query.q
    const access_token = await query.access_token
    return fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${current}`)}&format=json`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export default async function handler(req, res) {
    const response = await topTracks(req.query);
    const data = await response.json();
    return res.status(200).json(data !== undefined && data);
}