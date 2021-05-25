import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Account } from '../model/Account';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly APIurl = 'https://localhost:44387/api/';
  constructor(private http: HttpClient) { }
  getusers = async () => {
    try {
      return await this.http.get(this.APIurl+"GetUserList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getAccountByRole = async (role1,role2) => {
    try {
      return await this.http.get(this.APIurl+"AccountRole?role1="+role1+"&&role2="+role2).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getUserByAccountId = async (id) => {
    try {
      return await this.http.get(this.APIurl+"GetUserByAccountId?id="+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getuser = async(id) =>{
    try 
    {
      const user = await this.http.get(this.APIurl + "GetUser" + id).toPromise();
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
      // return await this.http.post(loginUrl, formData,httpOptions).toPromise();
      return await this.http.post(this.APIurl+"AddUser", formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }

  }

  deleteusers = async(id) =>{
    try {
      return await this.http.delete(this.APIurl + "DeleteUser" + id).toPromise();
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
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }
      return await this.http.put(this.APIurl + "EditUser" + id, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  public addAccount = async (account: Account) => {
    try {
        return await this.http.post(this.APIurl+"AddAccount", account).toPromise();
    }
    catch (error) {
      console.log(error);
    }
  }
  getaccount = async(id) =>{
    try 
    {
      return await this.http.get(this.APIurl + "GetAccount" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getaccounts = async() =>{
    try 
    {
      return await this.http.get(this.APIurl+"GetAccountList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updateaccount = async (id, account) => {
    try {
      //console.log(account);
      return await this.http.put(this.APIurl +"EditAccount"+ id, account).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  upToInstructor= async (id,account) => {
    try {
      //console.log(account);
      return await this.http.put(this.APIurl+ "updateinstructor/" + id,account).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
