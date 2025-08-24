import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faAt, faFingerprint} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationService} from "../../service/authentication.service";
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FaIconComponent,
        FormsModule,
        NgClass,
    ],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
    protected readonly faFingerprint = faFingerprint;
    protected readonly faAt = faAt;

    // Use signals only for UI state that needs reactivity
    isLoading = signal(false);
    errorMessage = signal('');
    loginFailed = signal(false);

    // Keep form handling traditional
    loginForm!: FormGroup;

    private authService = inject(AuthenticationService);
    private router = inject(Router);
    private fb = inject(FormBuilder);

    constructor() {
        this.loginForm = this.buildForm();
    }

    private buildForm(): FormGroup {
        return this.fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    ngOnInit() {
        if (this.authService.isAuthenticated()) {
            this.router.navigate([]).then(r => {
                console.log('Navigation success:', r);
            }).catch(err => {
                console.error('Navigation error:', err);
            });
        }
    }

    login() {
        if (this.loginForm.invalid) {
            Object.keys(this.loginForm.controls).forEach(key => {
                const control = this.loginForm.get(key);
                if (control) {
                    control.markAsTouched();
                }
            });
            this.errorMessage.set('Please fill out all required fields correctly.');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');
        this.loginFailed.set(false);

        this.authService.login(this.loginForm.value)
            .pipe(
                finalize(() => this.isLoading.set(false))
            )
            .subscribe({
                next: (response) => {
                    const returnUrl = history.state?.returnUrl;
                    this.router.navigateByUrl(returnUrl)
                        .catch((error) => console.error('Navigation error:', error));
                },
                error: (error) => {
                    console.error('Login failed:', error);
                    this.errorMessage.set(error?.error?.message || 'Login failed. Please try again.');
                    this.loginFailed.set(true);
                    setTimeout(() => {
                        this.loginFailed.set(false);
                    }, 500);
                }
            });
    }
}