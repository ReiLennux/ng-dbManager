import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackupsService {
  private apiUrl = "http://localhost:3000/api/mongo";

  constructor(private http: HttpClient) { }

  createBackup(dbName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/backups/${dbName}`, {});
  }

  listBackups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/backups`);
  }

  restoreBackup(dbName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/backups/restore/${dbName}`, {});
  }

  deleteBackup(filename: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/backups/${filename}`);
  }
}
