import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

export default function Home() {

    // const SPORTFY_AUTHENTICATION = "https://accounts.spotify.com/authorize"
    // const SPOTIFY_CLIENT_ID = "e5e4c494c00742d8845eab9e97cf26a2"
    // const redirect_url = "http://localhost:3000/play-list"
    // const space = "%20"
    // const scope = ["user-read-currently-playing", "user-top-read"];
    // const scope_url_param = scope.join(space)

    // const handleLogin = () => {
    //     window.location = `${SPORTFY_AUTHENTICATION}?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${redirect_url}&scope=${scope_url_param}&show_dialog=true`
    // }
    const login = () => {
        signIn('spotify')
    }

    const { data: session } = useSession();
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.push("/play-list")
        }
    }, [session])
    return (
        <>
            <button className='loginButton' onClick={login} >
                login
            </button>
        </>
    )
}
