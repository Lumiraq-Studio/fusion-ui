import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../modules/authentication/service/authentication.service";


export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const requiredRole = route.data['requiredRole'];

  if (authService.hasRole(requiredRole)) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const requiredPermission = route.data['requiredPermission'];

  if (authService.hasPermission(requiredPermission)) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};