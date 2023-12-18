const topTracks = async (query) => {
    const id = await query.id
    const access_token = await query.access_token
    return fetch(`https://api.spotify.com/v1/tracks/${id}`, {
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