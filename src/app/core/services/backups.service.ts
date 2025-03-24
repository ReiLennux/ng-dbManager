import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bkpsform } from '../../models/bkps/bkpsform.dto';
import { Bkpsview } from '../../models/bkps/bkpsview.dto';

@Injectable({
  providedIn: 'root'
})
export class BackupsService {

  private apiUrl = "http://localhost:3000/api/backups"; // Usa environment para manejar la URL

  constructor(private http: HttpClient) { }

  backupDatabase(bkpsform: Bkpsform): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, bkpsform);
  }

// Elimina async/await y devuelve directamente el Observable
getBackups(dbname: string): Observable<Bkpsview[]> {
  console.log("getBackups", dbname);
  return this.http.get<Bkpsview[]>(`${this.apiUrl}/${dbname}`);
}
  
}
