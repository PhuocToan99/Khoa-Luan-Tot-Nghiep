import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private urlAPI = 'https://localhost:44387';
    constructor(private http: HttpClient) { }
    public getsearchcourse = (name: string) => {
        const getUrl = `${this.urlAPI}/api/Courses/GetCourse/${name}`;
        return this.http.get<any>(getUrl).pipe(
            map((courses) => {
                if (courses != null) {
                    const getcourse = [];
                    courses.forEach(element => {
                        getcourse.push(element);
                    });
                    console.log(getcourse);
                    return getcourse;
                }
                else {
                    return null;
                }
            })
        )
    }
    public getAllCourse = () => {
        const getProductUrl = `${this.urlAPI}/api/Courses/`;
        return this.http.get<any>(getProductUrl).pipe(
            map((courses) => {
                if (courses != null) {
                    const getCourse = [];
                    courses.forEach(element => {
                        getCourse.push(element);
                    });
                    console.log(getCourse);
                    return getCourse;
                }
                else {
                    return null;
                }
            })
        )
    }
}
