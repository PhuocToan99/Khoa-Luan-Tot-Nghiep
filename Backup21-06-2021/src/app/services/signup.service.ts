import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../model/Account';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  // private urlAPI = 'https://localhost:44387';
  private readonly urlAPI = 'http://localhost:5001';
  constructor( private http: HttpClient) { }

  public addAccount = async (account: Account) => {
    try {
        const loginUrl = `${this.urlAPI}/api/Accounts`;
        return await this.http.post(loginUrl, account).toPromise();
    }
    catch (error) {
      console.log(error);
    }
  }
}
