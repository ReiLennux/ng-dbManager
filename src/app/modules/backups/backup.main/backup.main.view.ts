import { Component, OnInit } from '@angular/core';
import { DbsService } from '../../../core/services/dbs.service';
import { DbviewDto } from '../../../models/dbs/dbview-dto';

@Component({
  selector: 'app-backup.main',
  standalone: false,
  templateUrl: './backup.main.view.html',
})
export class BackupMainView implements OnInit {
  dbs: DbviewDto[] = [];
  openModals: { [key: string]: boolean } = {};

  constructor(private dbService: DbsService) { }

  ngOnInit(): void {
    this.getDbs();
  }

  getDbs(): void {
    this.dbService.getDbs().subscribe(dbs => this.dbs = dbs);
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