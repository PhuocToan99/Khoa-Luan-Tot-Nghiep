import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Account } from '../model/Account';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private urlAPI = 'https://localhost:44387/api/Users';
  private urlAPIaccount = 'https://localhost:44387';
  constructor(private http: HttpClient) { }
  getusers = async () => {
    try {
      return await this.http.get(this.urlAPI).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }

  getuser = async(id) =>{
    try 
    {
      const user = await this.http.get(this.urlAPI + "/" + id).toPromise();
      return user;
    }
    catch (e) {
      console.log(e);
    }
  }
  postuser = async (user: User) => {
    try 
    { 
      // const httpOptions = {
      //   headers: new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'})
      // };
      //console.log(user);
      var formData = new FormData();
      formData.append('firstName',user.firstName);
      formData.append('lastName',user.lastName);
      formData.append('phoneNumber',user.phoneNumber);
      formData.append('createdDate',(user.createdDate).toString());
      formData.append('lastLogOnDate',(user.lastLogOnDate).toString());
      formData.append('email',user.email);
      formData.append('gender',user.gender);
      if (user.avatarPath)
      {
        formData.append('avatarPath', user.avatarPath);
      }
      formData.append('balance',user.balance.toString());
      //Log FormData
      /*for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }*/
      const loginUrl = `${this.urlAPIaccount}/api/Users`;
      // return await this.http.post(loginUrl, formData,httpOptions).toPromise();
      return await this.http.post(loginUrl, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }

  }

  deleteusers = async(id) =>{
    try {
      return await this.http.delete(this.urlAPI + "/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  
  //
  updateusers = async (id, user) => {
    try 
    {
      const formData: FormData = new FormData();
      user.createdDate = moment(user.createdDate).format("MM/DD/YYYY");
      user.lastLogOnDate = moment(user.lastLogOnDate).format("MM/DD/YYYY");
      formData.append('userId',user.userId);
      formData.append('firstName',user.firstName);
      formData.append('lastName',user.lastName);
      formData.append('createdDate',(user.createdDate).toString());
      formData.append('lastLogOnDate',(user.lastLogOnDate).toString());
      formData.append('email',user.email);
      formData.append('phoneNumber',user.phoneNumber);
      formData.append('gender',user.gender);
      formData.append('balance',user.balance);
      console.log(formData);
      return await this.http.put(this.urlAPI + "/" + id, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  public addAccount = async (account: Account) => {
    try {
        const loginUrl = `${this.urlAPIaccount}/api/Accounts`;
        return await this.http.post(loginUrl, account).toPromise();
    }
    catch (error) {
      console.log(error);
    }
  }
  blockuser = async (id, account) => {
    try 
    {
      return await this.http.put('https://localhost:44387/api/Accounts/' + id, account).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getaccount = async(id) =>{
    try 
    {
      const accountUrl = `${this.urlAPIaccount}/api/Accounts`;
      const user = await this.http.get(accountUrl + "/" + id).toPromise();
      return user;
    }
    catch (e) {
      console.log(e);
    }
  }
  getaccounts = async() =>{
    try 
    {
      const accountUrl = `${this.urlAPIaccount}/api/Accounts`;
      const user = await this.http.get(accountUrl).toPromise();
      return user;
    }
    catch (e) {
      console.log(e);
    }
  }
  addSignupUser = async (id) => {
    try 
    {
      const formData: FormData = new FormData();
      formData.append('firstName','');
      formData.append('lastName','');
      formData.append('gender','');
      formData.append('createdDate','');
      formData.append('lastLogOnDate','');
      formData.append('email','');
      formData.append('phoneNumber','');
      formData.append('avatarPath', '');
      formData.append('balance', id);
      formData.append('image-upload','');
      console.log(formData);
      return await this.http.post(this.urlAPI, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updateaccount = async (id, account) => {
    try {
      //console.log(account);
      return await this.http.put('https://localhost:44387/api/Accounts/' + id, account).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}