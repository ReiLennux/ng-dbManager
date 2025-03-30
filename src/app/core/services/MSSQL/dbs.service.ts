import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DbviewDto } from '../../../models/MSSQL/dbs/dbview-dto';

@Injectable({
  providedIn: 'root'
})
export class DbsService {

  private apiUrl = "http://localhost:3000/api/mssql/databases"; // Usa environment para manejar la URL

  constructor(private http: HttpClient) { }

  getDbs(): Observable<DbviewDto[]> {
    return this.http.get<DbviewDto[]>(`${this.apiUrl}`);
  }

  createDb(db: DbviewDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, db);
  }

  getSchemas(dbName: string): Observable<{ SchemaName: string }[]> {
    return this.http.get<{ SchemaName: string }[]>(`${this.apiUrl}/${dbName}/schemas`).pipe(
      tap(response => console.log(response)) // Para ver la respuesta en la consola
    );
  }

  getTables(dbName: string): Observable<{ SchemaName: string, TableName: string }[]> {
    return this.http.get<{ SchemaName: string, TableName: string }[]>(`${this.apiUrl}/${dbName}/tables`).pipe(
      tap(response => console.log(response)) // Para ver la respuesta en la consola
    );
  }
  
}
