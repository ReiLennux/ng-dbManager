import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImpexpService } from '../../../../core/services/Mongo/impexp.service';
import { DbsService } from '../../../../core/services/Mongo/dbs.service';

@Component({
  selector: 'app-impexp.main',
  standalone: false,
  templateUrl: './impexp.main.view.html',
})
export class ImpexpMainView implements OnInit {
  operationType = 'export';

  exportForm!: FormGroup;
  importForm!: FormGroup;

  responseMessage: string = '';
  responseType: 'success' | 'error' = 'success';

  dbs: any[] = [];
  collections: any[] = [];
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private impexpService: ImpexpService,
    private dbService: DbsService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.getDbs();
  }

  initForms() {
    this.exportForm = this.fb.group({
      databaseName: ['', Validators.required],
      collectionName: ['', Validators.required],
      exportType: ['json', Validators.required],
    });

    this.importForm = this.fb.group({
      importDbName: ['', Validators.required],
      importCollection: ['', Validators.required],
    });
  }

  getDbs() {
    this.dbService.getDatabases().subscribe(dbs => this.dbs = dbs);
  }

  getCollections() {
    const dbName = this.exportForm.get('databaseName')?.value;
    if (dbName) {
      this.dbService.getCollections(dbName).subscribe(collections => this.collections = collections);
    }
  }

  getCollectionsImport() {
    const dbName = this.importForm.get('importDbName')?.value;
    if (dbName) {
      this.dbService.getCollections(dbName).subscribe(collections => this.collections = collections);
    }
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onExport() {
    if (this.exportForm.invalid) {
      this.responseMessage = 'Por favor, complete todos los campos.';
      this.responseType = 'error';
      return;
    }
  
    const { databaseName, collectionName, exportType } = this.exportForm.value;
    
    this.impexpService.exportData(exportType, databaseName, collectionName).subscribe({
      next: (response: any) => {
        console.log(response);
        const fileType = exportType === 'json' ? 'application/json' : 'text/csv';
        const fileExtension = exportType === 'json' ? 'json' : 'csv';
        
        // Convertir el objeto JSON a una cadena de texto
        const data = exportType === 'json' ? JSON.stringify(response.data, null, 2) : response.data;
        
        // Crear un Blob para el archivo
        const blob = new Blob([data], { type: fileType });
        const url = window.URL.createObjectURL(blob);
  
        // Crear un enlace invisible para descargar
        const a = document.createElement('a');
        a.href = url;
        a.download = `${collectionName}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
  
        // Liberar memoria
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
  
        this.responseMessage = 'Datos exportados correctamente!';
        this.responseType = 'success';
      },
      error: () => {
        this.responseMessage = 'Error al exportar datos.';
        this.responseType = 'error';
      }
    });
  }  

  onImport() {
    if (this.importForm.valid && this.selectedFile) {
      const { importDbName, importCollection } = this.importForm.value;
      const fileReader = new FileReader();
  
      fileReader.onload = () => {
        const fileData = fileReader.result as string;
        const fileType = this.selectedFile!.name.split('.').pop()?.toLowerCase();
  
        if (fileType === 'json') {
          // Si es JSON, parseamos y enviamos
          try {
            const jsonData = JSON.parse(fileData);
            this.impexpService.importData('json', importDbName, importCollection, jsonData).subscribe({
              next: () => {
                this.responseMessage = 'Datos importados correctamente!';
                this.responseType = 'success';
              },
              error: () => {
                this.responseMessage = 'Error al importar datos.';
                this.responseType = 'error';
              }
            });
          } catch (error) {
            this.responseMessage = 'Error al procesar el archivo JSON.';
            this.responseType = 'error';
          }
        } else if (fileType === 'csv') {
          // Si es CSV, enviamos como string
          this.impexpService.importData('csv', importDbName, importCollection, fileData).subscribe({
            next: () => {
              this.responseMessage = 'Datos importados correctamente!';
              this.responseType = 'success';
            },
            error: () => {
              this.responseMessage = 'Error al importar datos.';
              this.responseType = 'error';
            }
          });
        } else {
          this.responseMessage = 'Formato de archivo no soportado. Use JSON o CSV.';
          this.responseType = 'error';
        }
      };
  
      fileReader.readAsText(this.selectedFile);
    } else {
      this.responseMessage = 'Por favor, complete todos los campos y seleccione un archivo.';
      this.responseType = 'error';
    }
  }
  

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        this.selectedFileName = input.files[0].name;
    }
  }
}
