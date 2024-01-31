const getUser = async (query) => {
    const access_token = await query.access_token
    return fetch(`https://api.spotify.com/v1/me`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export default async function handler(req, res) {
    const response = await getUser(req.query);
    const user = await response.json();
    return res.status(200).json(user !== undefined && user);
}