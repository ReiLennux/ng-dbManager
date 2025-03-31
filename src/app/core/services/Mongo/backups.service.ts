import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class BackupsService {
  private apiUrl = `${environment.API_URL}/mongo`;

  constructor(private http: HttpClient) { }

  // Crear un backup de una base de datos
  createBackup(dbName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/backups/${dbName}`, {});
  }

  // Listar los backups, con un parámetro opcional dbName para filtrar
  listBackups(dbName?: string): Observable<any[]> {
    const url = dbName ? `${this.apiUrl}/backups?dbName=${dbName}` : `${this.apiUrl}/backups`;
    return this.http.get<any[]>(url);
  }

  // Restaurar un backup especificando el nombre del archivo de backup
  restoreBackup(backupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/backups/restore/${backupName}`, {});
  }

  // Eliminar un backup
  deleteBackup(filename: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/backups/${filename}`);
  }
}
