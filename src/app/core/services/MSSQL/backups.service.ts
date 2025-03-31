import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bkpsform } from '../../../models/MSSQL/bkps/bkpsform.dto';
import { Bkpsview } from '../../../models/MSSQL/bkps/bkpsview.dto';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class BackupsService {

        private apiUrl = `${environment.API_URL}/mssql/backups`;

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
