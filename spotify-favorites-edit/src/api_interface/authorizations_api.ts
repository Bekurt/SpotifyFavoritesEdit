import { addBaseSpotifyPath, addQueryParams, apiRequest } from './base_methods'

/**
 * Step 1 of spotify authentication flow: requests user authorization
 *
 * @param clientId app id
 * @param codeChallenge code for validation
 * @returns response from spotify api
 */
export function requestUserAuthorization(clientId: string, codeChallenge: string) {
    const queryParams = {
        client_id: clientId,
        response_type: 'code',
        redirect_uri: 'https://localhost:5173/',
        scope: 'user-read-playback-position user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public',
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
    }

    const completeUrl = addQueryParams(addBaseSpotifyPath('/authorize'), queryParams)
    return completeUrl //apiRequest('get', completeUrl, {})
}
