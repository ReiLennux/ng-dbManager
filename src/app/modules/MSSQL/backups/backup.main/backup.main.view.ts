import { Component, OnInit } from '@angular/core';
import { DbsService } from '../../../../core/services/MSSQL/dbs.service';
import { DbviewDto } from '../../../../models/MSSQL/dbs/dbview-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackupsService } from '../../../../core/services/MSSQL/backups.service';
import { Bkpsview } from '../../../../models/MSSQL/bkps/bkpsview.dto';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-backup.main',
  standalone: false,
  templateUrl: './backup.main.view.html',
})
export class BackupMainView implements OnInit {
  dbs: DbviewDto[] = [];
  openModals: { [key: string]: boolean } = {};
  BackupForm: FormGroup;
  backups: Bkpsview[] = [];
  success: boolean = false;
  failrule = false

    backupOptions = [
    { value: 'full', label: 'Respaldo Completo', description: 'Respaldo completo de la base de datos.' },
    { value: 'differential', label: 'Respaldo Diferencial', description: 'Respaldo de cambios hechos desde el último backup completo.' },
    { value: 'log', label: 'Respaldo de logs', description: 'Respaldo solo del log de transacciones.' }
  ];

  constructor(
    private fb: FormBuilder,
    private dbService: DbsService,
    private bkService: BackupsService
  ) { 
    this.BackupForm = this.fb.group({
      backupType: ['full', Validators.required],
      dbname: ['', Validators.required],
    });

  }

  setDb(db: string) {
    this.BackupForm.patchValue({
      dbname: db,
    });
  }

  ngOnInit(): void {
    this.getDbs();
  }

  onSubmit(dbId: string): void {
    if (this.BackupForm.valid) {
      console.log(this.BackupForm.value);
      this.bkService.backupDatabase(this.BackupForm.value).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 5000);
          this.toggleModal(dbId)
        }
      });
    } else {
      this.failrule = true;
      setTimeout(() => {
        this.failrule = false;
      }, 5000);
    }
  }


  markFormGroupTouched(BackupForm: FormGroup<any>) {
    Object.values(BackupForm.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  
  async getbackups(dbName: string) {
    try {
      const backups$ = this.bkService.getBackups(dbName);
      this.backups = await lastValueFrom(backups$);  // Convierte Observable a Promise
    } catch (error) {
      console.error('Error fetching backups:', error);
    }
  }

  getDbs(): void {
    this.dbService.getDbs().subscribe(dbs => this.dbs = dbs);
  }

  GetType(type: string): string {
    if (type === 'D') return "FULL"
    if (type === 'I') return "DIFFERENTIAL"
    if (type === 'L') return "LOG"
    return 'no es un backup valido D:'
  }



















  async openModalWithBackups(databaseName: string) {
    await this.getbackups(databaseName);  // Espera a que se completen los datos
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
  downloadBackup(dbId: string): void {
    // Lógica para descargar backup
    console.log('Descargando backup de:', dbId);
  }
}