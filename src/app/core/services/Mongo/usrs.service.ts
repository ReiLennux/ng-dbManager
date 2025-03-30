import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsrsService {
  private apiUrl = "http://localhost:3000/api/mongo/login-users";

  constructor(private http: HttpClient) { }

  createUser(data: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  deleteUser(username: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${username}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
