// pages/api/token.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { refresh } = req.body;

        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        const authorizationHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': authorizationHeader,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refresh,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                res.status(response.status).json(data);
            } else {
                console.error('Error:', response.statusText);
                res.status(response.status).json({ error: response.statusText });
            }
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
