import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Certificate } from '../model/certificate';
@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private readonly urlAPI = 'http://localhost:5001/api/';
  constructor(private http: HttpClient) { }
  getcertificates = async () => {
    try {
      return await this.http.get(this.urlAPI+"GetCertificateList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postcertificate = async (certificate: Certificate) => {
    try {
        return await this.http.post(this.urlAPI+"AddCertificate", certificate).toPromise();
      }
      catch (e) {
        console.log(e);
      }
    }
  deletecertificate = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "DeleteCertificate" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatecertificate = async (id, certificate) => {
    try 
    {
      return await this.http.put(this.urlAPI + "EditCertificate" + id,certificate).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getAllCertificateByAccountId = async (accountId) => {
    try {
      return await this.http.get(this.urlAPI+"GetAllCertificateByAccountId?accountId="+accountId).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getLastestCertificateByAccountId = async (accountId) => {
    try {
      return await this.http.get(this.urlAPI+"GetLastestCertificateByAccountId?accountId="+accountId).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getCertificateByCourseAccountId = async (accountId,courseId) => {
    try {
      return await this.http.get(this.urlAPI+"GetCertificateByCourseAccountId?accountId="+accountId+"&courseId="+courseId).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
