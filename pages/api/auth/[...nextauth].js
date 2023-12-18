import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify";
export const authOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            // authorization: {
            //     params: {
            //       prompt: "consent",
            //       access_type: "offline",
            //       response_type: "code",
            //       redirect_uri:"http://192.168.10.147:3000/api/auth/callback/spotify"
            //     }
            //   }
        })
    ],
    // site:"http://192.168.10.147:3000/play-list",
    jwt: {
        maxAge: 30 * 24 * 60 * 60,
        encryption: true
    },
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken
            return session
        }
    }
}

export default NextAuth(authOptions)