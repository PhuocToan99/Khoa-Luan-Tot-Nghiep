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
    // if( this.currentAccount != null ) flag = true;
    let role: string = route.data["role"];
    let role1: string = route.data["role2"];
    if(this.currentAccount.role != role){
      if((role1 != undefined || role1 != null) && this.currentAccount.role != role1){
      alert("You don't have permission to access this url");
      this.router.navigate(['/accessdenied'])
      }
    }
    return true;
    // if(flag == true && (this.currentAccount.role == role || this.currentAccount.role == role1)){
    //   return true;
    // }
  }
  
}
