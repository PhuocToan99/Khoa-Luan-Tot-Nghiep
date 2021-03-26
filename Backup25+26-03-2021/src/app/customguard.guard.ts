import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { Account } from  './model/Account';
@Injectable({
  providedIn: 'root'
})
export class CustomguardGuard implements CanActivate {
  public currentAccount: Account;
  constructor (private authencationService: AuthenticationService, private router: Router) {
    this.authencationService.currentAccount.subscribe(x => this.currentAccount = x);
   }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var flag = false;
    if( this.currentAccount == null ) this.router.navigate(['/login']);
    if( this.currentAccount != null ) flag = true;
    let role: string = route.data["role"];
    if(this.currentAccount.role != role){
      alert("You don't have permission to access this url");
      this.router.navigate(['/accessdenied'])
    }
    if(flag == true && this.currentAccount.role == role){
      return true;
    }
  }
  
}
