const topTracks = async (query) => {
    const data = await query.q
    const access_token = await query.access_token
    return fetch(`https://api.spotify.com/v1/search?query=${data}&type=track&include_external=audio&limit=50`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export default async function handler(req, res) {
    const response = await topTracks(req.query);
    const { tracks } = await response.json();
    return res.status(200).json(tracks !== undefined && tracks);
}