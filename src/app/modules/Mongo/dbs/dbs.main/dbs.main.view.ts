import { Component, OnInit } from '@angular/core';
import { DbsService } from '../../../../core/services/Mongo/dbs.service';
import { lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dbs.main',
  standalone: false,
  templateUrl: './dbs.main.view.html',
})
export class DbsMainView implements OnInit {
  dbs: any[] = [];
  colecciones: any[] = [];
  collectionForm : FormGroup;

  constructor(private fb: FormBuilder,private dbService: DbsService) { 
    this.collectionForm = this.fb.group({
      dbName: ['putamadre', Validators.required],
      collectionName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getdbs(); 
  }


  setDb(db: string) {
    this.collectionForm.patchValue({
      dbName: db,
    });
  }

  getdbs(): any[] {
    this.dbService.getDatabases().subscribe(dbs => {
      this.dbs = dbs;
    });
    return this.dbs; 
  }

  onSubmit(){
    console.log(this.collectionForm.value);
    if (this.collectionForm.valid) {
      this.dbService.createCollection(this.collectionForm.value).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.getdbs();
          const dbName = this.collectionForm.get('dbName')?.value;
            this.getColecciones(dbName!);
          this.collectionForm.reset();
        }
      });
    }
  }

  size(size: number): string {
    if (size < 0) {
      return '0 B';
    } else if (size > 0 && size < 1024) {
      return size + ' B';
    }
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
  }


    async getColecciones(dbName: string) {
      console.log("getColecciones", dbName);  // Para verificar que se esta llamando a la función
      try {
        const coleccion$ = this.dbService.getCollections(dbName);
        this.colecciones = await lastValueFrom(coleccion$);
      } catch (error) {
        console.error('Error fetching coleccion:', error);
      }
    }


    deleteDatabase(dbName: string) {
      this.dbService.deleteDatabase(dbName.toString()).subscribe(res => {
        if (res.success) {
          this.getdbs();
          this.collectionForm.reset();
        }
      });
    }

    deleteCollection(dbName: string, collectionName: string) {
      this.dbService.deleteCollection(dbName.toString(), collectionName).subscribe(res => {
        if (res.success) {
          this.getColecciones(dbName);
        }
      });
    }


  //#region Modal Helpers
  openModals: { [key: string]: boolean } = {};

  async openModalWithColecciones(databaseName: string) {
    await this.getColecciones(databaseName);  // Espera a que se completen los datos
    this.toggleModal(databaseName);       // Ahora abre el modal
  }

  toggleModal(dbId: string): void {
    this.openModals[dbId] = !this.openModals[dbId];
  }
  isModalOpen(dbId: string): boolean {
    return !!this.openModals[dbId];
  }
  confirmBackup(dbId: string): void {
    // Lógica para confirmar el backup
    console.log('Generando backup para:', dbId);
    this.toggleModal(dbId);
  }

  //#endregion


}
