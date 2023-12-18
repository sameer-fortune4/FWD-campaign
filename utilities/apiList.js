const baseUrl = "http://localhost:3000/"
export const apiList = {
    PLAY_LIST: baseUrl + "api/stats/playlist",
    PLAY_SONG: baseUrl + "api/play/player",
    FILTER_SONG: baseUrl + "api/filter/filterByPlaylistSong",
    FILTER_BY_TRACK_SONG: baseUrl + "api/filter/filterByTrackSong",
    SINGLE_SONG: baseUrl + "api/filter/track"
}