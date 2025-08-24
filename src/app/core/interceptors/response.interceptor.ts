import {Injectable} from '@angular/core'
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http'
import {Observable, throwError} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'


@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // console.log(error)
        if(error.error.statusCode == 401 || error.status == 401){
          // this.authService.logout()
        }
        return throwError(error)
      })
    )
  }
}
