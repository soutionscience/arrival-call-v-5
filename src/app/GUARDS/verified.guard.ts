import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppStorageService } from '../SERVICES/app-storage.service';


@Injectable({
  providedIn: 'root'
})
export class VerifiedGuard implements CanActivate {
  constructor(private appStorage: AppStorageService, private router: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.appStorage.isVerified()
      .then((result) => {
        if (result) {
          return true;
        }
        else {
          this.router.navigate(['/register']);
          return false;
        }
      });
     

       
    
    
  }
  
}
