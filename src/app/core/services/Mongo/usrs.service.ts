import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UsrsService {
        private apiUrl = `${environment.API_URL}/mongo/login-users`;

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
