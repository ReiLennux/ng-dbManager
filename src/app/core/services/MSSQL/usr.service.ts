import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usrviewDto } from '../../../models/MSSQL/usrs/usrview-dto';
import { Observable } from 'rxjs';
import { usrformDto } from '../../../models/MSSQL/usrs/usrform-dto';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UsrService {
          private apiUrl = `${environment.API_URL}/mssql/login-users`;
  constructor(private http: HttpClient) { }

  getUsers(): Observable<usrviewDto[]> {
    return this.http.get<usrviewDto[]>(`${this.apiUrl}`);
  }

  createUser(user: usrformDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user);
  }

  deleteUser(username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${username}`);
  }

  
}
