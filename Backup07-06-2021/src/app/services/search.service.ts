import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Course } from '../model/course';
@Injectable({
    providedIn: 'root'
})
export class SearchService {
    // private readonly urlAPI = 'https://localhost:44387';
    private readonly urlAPI = 'http://localhost:5001';
    constructor(private http: HttpClient) { }
    public getsearchcourse = (name,option,accountId) => {
        const getUrl = `${this.urlAPI}/api/SearchCourse?name=${name}&option=${option}&accountId=${accountId}`;
        return this.http.get<any>(getUrl).pipe(
            map((courses) => {
                if (courses != null) {
                    const getcourse: Course[] = [];
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
        const getProductUrl = `${this.urlAPI}/api/GetCourseList`;
        return this.http.get<any>(getProductUrl).pipe(
            map((courses) => {
                if (courses != null) {
                    const getCourse: Course[] = [];
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
