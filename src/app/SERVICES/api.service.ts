import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly URL = 'assets/data/places.json'

  constructor(private restangular: Restangular, private http: HttpClient) { }

  public getJson(): Observable<any>{
    return this.http.get(this.URL)
  }

  postResource(route, resource): Observable<any>{
    return this.restangular.all(route).post(resource)
  }
  postTrip(route, userId, resource): Observable<any>{
    return resource
    //return this.restangular.one(route, userId).post(resource)
  }
  getResource(route): Observable<any>{
    return this.restangular.all(route).getList()
  }
  postSpecificResource(route, id, item, resource):Observable<any>{
    return this.restangular.one(route, id).all(item).post(resource)
  }

}
