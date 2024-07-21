import { addBasePath, addQueryParams, apiRequest } from './base_methods'
import type { Token } from '@/stores/auth'

// Spotify-specific access privileges
const scopes = [
    'user-read-playback-position',
    'user-top-read',
    'user-read-recently-played',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
]

/**
 * Step 1 of spotify authentication flow: requests user authorization
 *
 * @param clientId app id
 * @param codeChallenge code for validation
 * @returns response from spotify api
 */
export function requestUserAuthorization(codeChallenge: string): string {
    const queryParams = {
        client_id: import.meta.env.VITE_SPOTIFY_ID,
        response_type: 'code',
        redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
        scope: scopes.reduce((acc, scopeItem) => `${acc} ${scopeItem}`, ''),
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
    }

    const completeUrl = addQueryParams(addBasePath('/authorize'), queryParams)
    return completeUrl
}

/**
 * Step 2 of spotify authentication flow. Request an access token
 *
 * @param code found in url query after a successful redirect from user permissions
 * @param codeVerifier code generated in the first step, should be retrieved from session storage
 * @returns Promise of type Token
 */
export function getAccessToken(code: string, codeVerifier: string): Promise<Token> {
    const payload = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
        scope: scopes.reduce((acc, scopeItem) => `${acc} ${scopeItem}`, ''),
        client_id: import.meta.env.VITE_SPOTIFY_ID,
        code_verifier: codeVerifier,
    }
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }
    return apiRequest('post', addBasePath('/api/token'), payload, config) as Promise<Token>
}

/**
 * Request a new access token if the old one is expired
 *
 * @param refreshToken refresh token found in the original access token response
 */
export function refreshAccessToken(refreshToken: string): Promise<Token> {
    const payload = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: import.meta.env.VITE_SPOTIFY_ID,
    }
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }
    return apiRequest('post', addBasePath('/api/token'), payload, config) as Promise<Token>
}
