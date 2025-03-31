import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DbsService {
    private apiUrl = `${environment.API_URL}/mongo/databases`;

  constructor(private http: HttpClient) { }

  createDatabase(data: { dbName: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getDatabases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  deleteDatabase(dbName: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${dbName}`);
  }

  getCollections(dbName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${dbName}/collections`);
  }

  createCollection(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${form.dbName}/collections`, { collectionName: form.collectionName });
  }

  deleteCollection(dbName: string, collectionName: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${dbName}/collections/${collectionName}`);
  }
}
