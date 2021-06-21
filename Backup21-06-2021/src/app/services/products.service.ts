import { Injectable } from '@angular/core';
import {Http,Response} from "@angular/http";
import { Observable, of } from "rxjs";
import { map, catchError} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  
  constructor(public http: Http) { }

  public getProducts(dataURL:string){
      return this.http.get(dataURL).pipe(
        map((res: any) => res.json()),
        catchError(<T>(error: any, result?: T) => {
          console.log(error);
          return of(result as T);
        }));
  }
}
