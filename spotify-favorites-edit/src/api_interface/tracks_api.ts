import { useTokenStore } from '@/stores/token'
import { useQuery } from '@tanstack/vue-query'
import type { Paging, SavedTrack, Track } from 'spotify-types'
import type { Ref } from 'vue'
import { addQueryParams } from './axios_interface'

const { apiRequestWithRefresh } = useTokenStore()

export function getTrack(id: Ref<string>, queryParams: Ref<{ market?: string }>) {
    const url = addQueryParams(`/v1/tracks/${id}/`, queryParams.value)
    return useQuery({
        queryKey: ['getTrack', id],
        queryFn: ({ signal }) => apiRequestWithRefresh<Track>('get', url, {}, signal),
        retry: false,
    })
}

export function getSavedTracks(queryParams: Ref<{ limit: number; offset: number; market?: string }>) {
    const url = addQueryParams('/v1/me/tracks/', queryParams.value)
    return useQuery({
        queryKey: ['getSavedTracks', queryParams],
        queryFn: ({ signal }) => apiRequestWithRefresh<Paging<SavedTrack>>('get', url, {}, signal),
        retry: false,
    })
}
