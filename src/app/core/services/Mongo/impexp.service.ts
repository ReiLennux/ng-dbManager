import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environments';

interface ExportResponse {
  success: boolean;
  message: string;
  data?: any;  // Se usará para los datos exportados (JSON o CSV)
}

@Injectable({
  providedIn: 'root'
})
export class ImpexpService {
      private apiUrl = `${environment.API_URL}/mongo/expimp`;

  constructor(private http: HttpClient) {}

  // Método para exportar datos (JSON o CSV)
  exportData(type: 'json' | 'csv', dbName: string, collection: string): Observable<ExportResponse> {
    return this.http.get<ExportResponse>(`${this.apiUrl}/${type}/${dbName}/${collection}`).pipe(
      catchError(this.handleError)  // Manejo de errores
    );
  }

  // Método para importar datos (JSON o CSV)
  importData(type: 'json' | 'csv', dbName: string, collection: string, data: JSON | string ): Observable<ExportResponse> {
    console.log(`${this.apiUrl}/import/${type}/${dbName}/${collection}`, { data });
  
    return this.http.post<ExportResponse>(`${this.apiUrl}/import/${type}/${dbName}/${collection}`, { data }).pipe(
      catchError(this.handleError)
    );
  }
  

  // Función para manejar errores en la API
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
