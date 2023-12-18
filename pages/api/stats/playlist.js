// import { topTracks } from "../../../lib/spotify";

const topTracks = async (query) => {
    const data = await query.access_token
    return fetch(`https://api.spotify.com/v1/me/playlists`, {
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