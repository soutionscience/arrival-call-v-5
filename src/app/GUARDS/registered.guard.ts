import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppStorageService } from '../SERVICES/app-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RegisteredGuard implements CanActivate {
  //constructor(private appStorage: AppStorageService)
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //  this.appStorage.
    return true;
  }


}
