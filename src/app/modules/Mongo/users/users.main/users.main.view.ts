import { Component } from '@angular/core';
import { UsrsService } from '../../../../core/services/Mongo/usrs.service';

@Component({
  selector: 'app-users.main',
  standalone: false,
  templateUrl: './users.main.view.html',
})
export class UsersMainView {

    usrs: any[] = [];
    success: boolean = false;
    failure = false


    constructor(private usrService: UsrsService){}
  
    ngOnInit(): void {
      this.getUsers();
    }
  
    private getUsers(){
      this.usrService.getUsers().subscribe(users => this.usrs = users);
    }

    deleteUser(username: string) {
      this.usrService.deleteUser(username).subscribe(res => {
        console.log(res);  // TODO: Handle response better, e.g., display errors to the user.
        if (res.success) {
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 5000);
          this.getUsers();
        } else {
          this.failure = true;
          setTimeout(() => {
            this.failure = false;
          }, 5000);
        }
      });
    }






  //#region Modal Helpers
  openModals: { [key: string]: boolean } = {};

  toggleModal(userId: string): void {
    this.openModals[userId] = !this.openModals[userId];
  }
  isModalOpen(userId: string): boolean {
    return !!this.openModals[userId];
  }
  confirmBackup(userId: string): void {
    // Lógica para confirmar el backup
    console.log('Generando backup para:', userId);
    this.toggleModal(userId);
  }

  //#endregion



}
