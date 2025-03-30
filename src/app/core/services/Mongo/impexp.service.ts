import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpexpService {
  private apiUrl = "http://localhost:3000/api/mongo/expimp";

  constructor(private http: HttpClient) { }

  exportData(type: 'json' | 'csv', dbName: string, collection: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${type}/${dbName}/${collection}`);
  }
}
