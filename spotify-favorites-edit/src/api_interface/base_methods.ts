import axios from 'axios'

/**
 *  Tipi di richieste passabili ad apiRequest e requestWithTokenUpdate
 * */
type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

/**
 * Modella la generica risposta di un endpoint con paginazione.
 * T è un tipo generico che può essere passato all'interfaccia per specificare il contenuto di results
 * es. PaginatedResponse<{name: string}> => results = [{name: 'stringa1'}, {name: 'stringa2'}, ...]
 * */
export interface PaginatedResponse<T> {
    count: number
    next: string | null
    prev: string | null
    results: T[]
}

/**
 * Esegue una richiesta tramite axios e restituisce una promessa.
 * Restituire res.data al posto di res permette di usare "as Promise<T>" to let Typescript
 * recognize the return value of the promise
 *
 * Parametri:
 * - method: tipo di richiesta, limitato dalla specifica di Method
 * - url: stringa con l'url a cui inviare la richiesta
 * - payload: __*Oggetto*__ con info addizionali, come body di una post request od opzioni di axios
 * */
export function apiRequest<T extends Object>(method: Method, url: string, payload: T) {
    return new Promise((resolve, reject) => {
        axios[method](url, payload)
            .then((res) => resolve(res.data))
            .catch((err: any) => reject(err))
    })
}

/**
 * Completamente analoga ad "apiRequest", ma se il server restituisce un 401 per via del token scaduto
 * esegue il refresh del token e ripete la richiesta fallita. Per via della natura globale del
 * token non sono riuscito a disaccoppiare questa funzione dallo store di autenticazione.
 * */
export function requestWithTokenUpdate<T extends Object>(method: Method, url: string, payload: T) {
    return new Promise((resolve, reject) => {
        axios[method](url, payload)
            .then((res) => resolve(res.data))
            .catch((err: any) => {
                if (err.response?.status === 401 && err.response?.data?.code === 'token_not_valid') {
                } else reject(err.response)
            })
    })
}

/**
 * Funzione che aggiunge dei queryParam a un url.
 *
 * Parametri:
 * - url: una stringa alla quale appendere i queryParam
 * - queryParams: un dizionario di coppie (key: value) con cui costruire le query
 *
 * es. addQueryParams('api/clients/', {name: 'Attilio'}) => 'api/clients/?name=Attilio'
 * */
export function addQueryParams(url: string, queryParams: Record<string, any>) {
    const newUrl = new URL(url, axios.defaults.baseURL)
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(queryParams)) {
        params.set(key, value)
    }
    newUrl.search = params.toString()
    return newUrl.href
}

/**
 * Adds the base spotify endpoint to the input
 */
export function addBaseSpotifyPath(endpoint: string) {
    return `https://accounts.spotify.com${endpoint}`
}
