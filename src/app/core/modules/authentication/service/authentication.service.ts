import {Injectable, signal} from "@angular/core";
import {CachedAPIRequest} from "../../../classes";
import {HttpClient} from "@angular/common/http";
import {APIRequestResources} from "../../../enums";
import {tap} from "rxjs";
import {AuthResponse, UserInfo} from "../interfaces/authentication.entity";
import {Router} from "@angular/router";


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends CachedAPIRequest {
    private currentUser: UserInfo | null = null;
    $$LoggedUserID = signal(1)

    constructor(protected override http: HttpClient, protected router: Router) {
        super(http, APIRequestResources.AuthenticationService)
    }

    login = (login: any) => {
        return this.post<AuthResponse>(login, {endpoint: 'login'}).pipe(
            tap((response) => {
                const authData = response.data;
                this.setSession(authData);
                this.currentUser = {
                    userName: authData.userName,
                    userId: authData.userId,
                    role: authData.role,
                    permissions: authData.permissions
                };
                console.log('Current User:', this.currentUser);
            })
        );
    };

    private setSession(authResult: AuthResponse) {
        localStorage.setItem('access_token', authResult.access_token);
        localStorage.setItem('user_info', JSON.stringify({
            userName: authResult.userName,
            userId: authResult.userId,
            role: authResult.role,
            permissions: authResult.permissions
        }));
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');
        this.currentUser = null;
        this.router.navigateByUrl('login').then(r => r);
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('access_token');
        return !!token;
    }

    getUserInfo(): UserInfo | null {
        if (this.currentUser) {
            return this.currentUser;
        }
        const userInfo = localStorage.getItem('user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    }

    hasPermission(permission: string): boolean {
        const userInfo = this.getUserInfo();
        return userInfo?.permissions.includes(permission) ?? false;
    }

    hasRole(role: string): boolean {
        const userInfo = this.getUserInfo();
        return userInfo?.role === role;
    }
}