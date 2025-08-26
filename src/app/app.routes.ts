import {Routes} from '@angular/router';
import {InitialDataResolver} from "./core/resolvers/initial-data.resolver";
import {authGuard} from "./core/guards/auth.guard";
import {LayoutComponent} from "./core/components/layout/layout.component";
import {publicGuard} from "./core/guards/public.guard";
import {DashboardModule} from "./modules";

export const routes: Routes = [
    {
        path: 'login',
        canActivate: [publicGuard],
        data: {
            title: 'Sign In',
            animation: 'fadeIn'
        },
        resolve: {
            initialData: InitialDataResolver
        },
        loadChildren: () => import('./core/modules/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./modules')
                    .then(m => m.DashboardModule),
                data: {title: 'Dashboard'}
            },
            {
                path: 'orders',
                loadChildren: () => import('./modules')
                    .then(m => m.OrdersModule),
                data: {title: 'Orders'}
            },
            {
                path: 'inventory',
                loadChildren: () => import('./modules')
                    .then(m => m.InventoryModule),
                data: {title: 'Inventory'}
            },
            {
                path: 'customers',
                loadChildren: () => import('./modules')
                    .then(m => m.CustomersModule),
                data: {title: 'Customers'}
            },
            {
                path: 'payments',
                loadChildren: () => import('./modules')
                    .then(m => m.PaymentModule),
                data: {title: 'Payments'}
            },
            {
                path: 'notifications',
                loadChildren: () => import('./modules')
                    .then(m => m.NotificationsModule),
                data: {title: 'Notifications'}
            },
            {
                path: 'settings',
                loadChildren: () => import('./modules')
                    .then(m => m.SettingsModule),
                data: {title: 'Settings'}
            },
            {
                path: 'routes',
                loadChildren: () => import('./modules')
                    .then(m => m.RoutesModule),
                data: {title: 'Routes'}
            },
            {
                path: 'navoda-app',
                loadChildren: () => import('./modules')
                    .then(m => m.NavodaAppModule),
                data: {title: 'Navoda-app'}
            },
            {
                path: 'sales-persons',
                loadChildren: () => import('./modules')
                    .then(m => m.SalesPersonModule),
                data: {title: 'Sales Persons'}
            },
            {
                path: 'reports',
                loadChildren: () => import('./modules')
                    .then(m => m.ReportsModule),
                data: {title: 'Reports'}
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }

];