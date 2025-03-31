import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private apiUrl = `${environment.API_URL}/mongo`;

  constructor(private http: HttpClient) { }
}
