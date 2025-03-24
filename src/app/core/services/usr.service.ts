import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usrviewDto } from '../../models/usrs/usrview-dto';
import { Observable } from 'rxjs';
import { usrformDto } from '../../models/usrs/usrform-dto';

@Injectable({
  providedIn: 'root'
})
export class UsrService {

  private apiUrl = "http://localhost:3000/api/login-users"; // Usa environment para manejar la URL
  constructor(private http: HttpClient) { }

  getUsers(): Observable<usrviewDto[]> {
    return this.http.get<usrviewDto[]>(`${this.apiUrl}`);
  }

  createUser(user: usrformDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user);
  }

  
}
