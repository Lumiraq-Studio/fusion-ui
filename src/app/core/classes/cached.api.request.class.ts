import {HttpClient} from "@angular/common/http"
import {catchError, of, tap} from "rxjs"
import {environment} from "src/environments/environment"
import {APIRequestOptions, APIResponse} from "../interfaces"
import {APIRequestCacheStrategy, APIRequestMethod, APIRequestResource} from "../types"
import {APIRequest} from "./api.request.class"
import {ttlToMilliseconds} from "../utils";

export abstract class CachedAPIRequest extends APIRequest {

    private ttl: number

    protected constructor(protected override http: HttpClient, protected override resource: APIRequestResource) {
        super(http, resource)

        this.ttl = ttlToMilliseconds(environment.cache?.maxAge ?? '1h')
    }

    public override get<T>(options: APIRequestOptions, strategy: APIRequestCacheStrategy = 'performance') {
        const cacheKey = this.generateCacheKey('get', options)

        if (strategy === 'performance') {
            const cachedResponse = this.getFromCache(cacheKey)
            if (cachedResponse) return of<APIResponse<T>>(cachedResponse.value as APIResponse<T>)
        }

        return super.get<T>(options).pipe(tap(res => {
                this.saveToCache(cacheKey, res)
            }),
            catchError(err => {
                if (strategy === 'freshness') {
                    const cachedResponse = this.getFromCache(cacheKey)
                    // console.log("Freshness", cachedResponse?.value)
                    if (cachedResponse) return of<APIResponse<T>>(cachedResponse.value as APIResponse<T>)
                }
                throw new Error(err)
            }))
    }

    private generateCacheKey(method: APIRequestMethod, options: APIRequestOptions) {
        const optionsStr = JSON.stringify(options)
        return `${this.resource}|${method}|${optionsStr}`
    }

    private saveToCache(cacheKey: string, data: any) {
        sessionStorage.setItem(cacheKey, JSON.stringify({
            timestamp: new Date(),
            value: data
        }))
        this.cleanCache()
    }

    private cleanCache() {
        const numberOfKeys = sessionStorage.length
        const keys: any[] = []

        for (let i = 0; i < numberOfKeys; i++) {
            keys.push(sessionStorage.key(i))
        }
        // console.log(keys)
        for (const key of keys) {
            const localStorageData = sessionStorage.getItem(key)
            if (localStorageData) {
                // console.log(localStorageData)
                let data = JSON.parse(localStorageData)
                const dateObject = new Date(data.timestamp)
                const cacheTimestamp = dateObject.getTime()

                if (Date.now() - (cacheTimestamp) >= this.ttl) {
                    console.log(`Cache Removed (Expired)`)
                    sessionStorage.removeItem(key)
                }
            }
        }

        if (this.getLocalStorageSize(keys) > (environment.cache?.maxSize ?? 5000)) {
            const key = Array.from(keys).pop()
            const localStorageData = sessionStorage.getItem(key) ?? "NULL"
            let data = JSON.parse(localStorageData)
            if (key) {
                console.log(`Cache Removed (Limit Exceeded)`)
                sessionStorage.removeItem(key)
            }
        }
    }

    private getFromCache(cacheKey: string) {
        this.cleanCache()
        const localStorageData = sessionStorage.getItem(cacheKey)
        if (localStorageData) {
            return JSON.parse(localStorageData)
        }
        return null
    }

    private getLocalStorageSize(keys: string[]) {
        let totalSizeBytes = 0
        for (let key of keys) {
            const value = sessionStorage.getItem(key)
            // Calculate the size of the key and value in bytes
            const keySize = key.length * 2 // Assuming 2 bytes per character (UTF-16)
            const valueSize = (value !== null ? value.length * 2 : 0)
            totalSizeBytes += keySize + valueSize
        }
        return (totalSizeBytes / 1024)
    }
}
