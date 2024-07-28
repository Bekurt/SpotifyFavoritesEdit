import axios, { type AxiosResponse } from 'axios'

/**
 *  Tipi di richieste passabili ad apiRequest e requestWithTokenUpdate
 * */
export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

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
 * @param method tipo di richiesta, limitato dalla specifica di Method
 * @param url stringa con l'url a cui inviare la richiesta
 * @param payload __*Oggetto*__ con il body della richiesta
 * @param config axios configuraton object
 * @returns Promise con la risposta del server
 */
export function apiRequest<DataType>(
    method: Method,
    url: string,
    payload?: Object,
    config?: Object
): Promise<DataType> {
    return new Promise((resolve, reject) => {
        axios[method](url, payload, config)
            .then((res: AxiosResponse<DataType, any>) => resolve(res.data))
            .catch((err: any) => reject(err))
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
        switch (typeof value) {
            case 'string':
                if (value !== '') params.set(key, value)
                break
            case 'object':
                if (value[0]) params.set(key, value)
                break
            default:
                params.set(key, value)
                break
        }
    }
    newUrl.search = params.toString()
    return newUrl.href
}
