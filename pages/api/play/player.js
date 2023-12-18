const topTracks = async (query) => {
    const data = await query.access_token
    const id = await query.id
    return fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        headers: {
            Authorization: `Bearer ${data !== undefined && data}`,
        },
    });
};

export default async function handler(req, res) {
    const response = await topTracks(req.query);
    const { items } = await response.json();
    return res.status(200).json(items !== undefined && items);
}