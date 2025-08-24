import {Injectable, signal} from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    isLoading = signal(false);

    set(loading: boolean) {
        this.isLoading.set(loading);
    }
}
