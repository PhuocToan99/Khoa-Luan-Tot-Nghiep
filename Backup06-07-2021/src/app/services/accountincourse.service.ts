import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountInCourse } from '../model/accountincourse';
@Injectable({
  providedIn: 'root'
})
export class AccountincourseService {
  private readonly urlAPI = 'http://localhost:5001/api/';
  constructor(private http: HttpClient) { }
  getaccountincourses = async () => {
    try {
      return await this.http.get(this.urlAPI+"GetAccountInCoursesList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getaccountincoursesByAccountId(id,option){
    try {
      return await this.http.get(this.urlAPI+"GetAccountInCoursesByAccountid?id="+id+"&option="+option).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getaccountincoursesByInvoiceCode(option,invoiceCode){
    try {
      return await this.http.get(this.urlAPI+"GetAccountInCoursesByInvoiceCode?option="+option+"&invoiceCode="+invoiceCode).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postaccountincourse = async (accountincourse: AccountInCourse) => {
    try {
      return await this.http.post(this.urlAPI+"AddAccountInCourse", accountincourse).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deleteaccountincourse = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "DeleteAccountInCourse" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async createInvoice(accountId,courseId,isBought,paymentMethod,invoiceCode,getPayment,createdDate){
    var invoiceCodeData = (!invoiceCode) ? this.makeid(6) : invoiceCode;
    var accountInCourse: AccountInCourse = new AccountInCourse();
    accountInCourse.accountId = accountId;
    accountInCourse.courseId = courseId;
    accountInCourse.isBought = isBought;
    accountInCourse.paymentMethod = paymentMethod;
    accountInCourse.invoiceCode = invoiceCodeData;
    accountInCourse.getPayment = getPayment;
    accountInCourse.createdDate = createdDate;
    await this.postaccountincourse(accountInCourse);
    return invoiceCodeData;
  }
  makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
  charactersLength)));
   }
   return result.join('');
  }
  postCart = async (accountincourse: AccountInCourse) => {
    try {
      return await this.http.post(this.urlAPI+"AddCartItem", accountincourse).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getCart(accountId){
    try {
      return await this.http.get(this.urlAPI+"GetCartList?id="+accountId).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deleteCart = async (accountId,courseId) =>{
    try {
      console.log(accountId+" "+courseId);
      return await this.http.delete(this.urlAPI + "DeleteCartItem?accountId="+accountId+"&courseId="+courseId).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
