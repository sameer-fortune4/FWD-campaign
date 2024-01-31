import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const authOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
                    scope: ['user-read-private', 'user-read-email', 'user-modify-playback-state', 'user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'streaming', 'playlist-modify-private', 'user-library-modify','playlist-modify-public'],
                },
            },
        }),
    ],
    site: process.env.NEXTAUTH_URL,
    jwt: {
        maxAge: 30 * 24 * 60 * 60,
        encryption: true,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
            }
            return token;
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            return session;
        },
    },
};

export default NextAuth(authOptions);
