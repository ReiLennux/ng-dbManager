import { Component, OnInit } from '@angular/core';
import { DbsService } from '../../../../core/services/Mongo/dbs.service';
import { BackupsService } from '../../../../core/services/Mongo/backups.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-backups-main',
  standalone: false,
  templateUrl: './backups.main.view.html',
})
export class BackupsMainView implements OnInit {
  dbs: any[] = [];
  openModals: { [key: string]: boolean } = {}; // Control de modales
  backups: any[] = [];
  success = false;
  failure = false;

  constructor(
    private dbService: DbsService,
    private bkService: BackupsService
  ) {}

  ngOnInit(): void {
    this.getBackups();
    this.getDbs();
  }


  async getDbs(){
    try {
      const result = await lastValueFrom(this.dbService.getDatabases());
      this.dbs = Array.isArray(result)? result : [];
    } catch (error) {
      console.error('Error fetching databases:', error);
      this.dbs = [];
    }
  }

  async getBackups() {
    try {
      const result = await lastValueFrom(this.bkService.listBackups());
      this.backups = Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error fetching backups:', error);
      this.backups = [];
    }
  }

  async handleBackupAction(action: 'create' | 'restore' | 'delete', dbName: string) {
    try {
      let response;
      if (action === 'create') {
        response = await lastValueFrom(this.bkService.createBackup(dbName));
      } else if (action === 'restore') {
        response = await lastValueFrom(this.bkService.restoreBackup(dbName));
      } else if (action === 'delete') {
        response = await lastValueFrom(this.bkService.deleteBackup(dbName));
      }
      await this.getBackups();
      
      if (response?.success) {
        this.showAlert(true);
        this.toggleModal(dbName);
        this.getDbs();
      } else {
        this.showAlert(false);
      }
    } catch (error) {
      console.error(`Error processing ${action} backup:`, error);
      this.showAlert(false);
    }
  }

  showAlert(success: boolean) {
    this.success = success;
    this.failure = !success;
    setTimeout(() => {
      this.success = false;
      this.failure = false;
    }, 5000);
  }

  toggleModal(dbId: string): void {
    this.openModals[dbId] = !this.openModals[dbId];
  }

  isModalOpen(dbId: string): boolean {
    return !!this.openModals[dbId];
  }
}
