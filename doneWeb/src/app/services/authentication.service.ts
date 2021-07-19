import { Injectable } from '@angular/core';
import { Account } from "../model/Account";
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentAccountSubject: BehaviorSubject<Account>;
  public currentAccount: Observable<Account>;
  private readonly urlAPI = 'http://localhost:5001';
  constructor(private http: HttpClient) {
    this.currentAccountSubject = new BehaviorSubject<Account>(
      JSON.parse(localStorage.getItem('currentAccount')));
    this.currentAccount = this.currentAccountSubject.asObservable();
  }
  public get currentAccountValue(): Account {
    return this.currentAccountSubject.value;
  }
  public login = (username: string, password: string) => {
    const loginUrl = `${this.urlAPI}/api/Signin`;
    return this.http.post<any>(loginUrl, { username, password })
      .pipe(
        map((account) => {
          if (account != null) {
            const newAccount = {} as Account;
            newAccount.accountId = account.accountId;
            newAccount.username = account.username;
            newAccount.role = account.role;
            newAccount.isActive = account.isActive;
            newAccount.userId = account.userId;
            localStorage.setItem('currentAccount', JSON.stringify(newAccount));
            localStorage.setItem('accountId', newAccount.accountId.toString());
            this.currentAccountSubject.next(newAccount);
            return account;
          }
          else {
            return null;
          }
        })
      );
  }

  public logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('currentAccount');
    this.currentAccountSubject.next(null);
  }
}
