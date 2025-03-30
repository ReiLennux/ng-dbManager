import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private apiUrl = "http://localhost:3000/api/mongo/"; 

  constructor(private http: HttpClient) { }
}
