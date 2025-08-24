import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';

interface InitialData {
    appName: string;
    version: string;
}

@Injectable({providedIn: 'root'})
export class InitialDataResolver implements Resolve<InitialData> {
    resolve() {
        return {
            appName: 'Lumiraq Fusion',
            version: '1.0.0'
        };
    }
}