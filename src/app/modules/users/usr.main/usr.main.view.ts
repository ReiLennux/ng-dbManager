import { Component, OnInit } from '@angular/core';
import { usrviewDto } from '../../../models/usrs/usrview-dto';
import { UsrService } from '../../../core/services/usr.service';

@Component({
  selector: 'app-usr.main',
  standalone: false,
  templateUrl: './usr.main.view.html',
})
export class UsrMainView implements OnInit {
  usrs: usrviewDto[] = [];

  constructor(private usrService: UsrService){}

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers(){
    // TODO: fetch users from API
    this.usrService.getUsers().subscribe(users => this.usrs = users);
  }

}
