import { Component, OnInit } from '@angular/core';
import { usrformDto } from '../../../models/usrs/usrform-dto';
import { usrviewDto } from '../../../models/usrs/usrview-dto';

@Component({
  selector: 'app-usr.main',
  standalone: false,
  templateUrl: './usr.main.view.html',
})
export class UsrMainView implements OnInit {
  usrs: usrviewDto[] = [];

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers(): usrviewDto[] {
    // TODO: fetch users from API
    // this.usrService.getUsers().subscribe(users => this.dbs = users);
    return this.usrs;
  }

}
