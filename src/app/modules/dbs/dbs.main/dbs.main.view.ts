import { Component, OnInit } from '@angular/core';
import { DbsService } from '../../../core/services/dbs.service';
import { DbviewDto } from '../../../models/dbs/dbview-dto';

@Component({
  selector: 'app-dbs.main',
  standalone: false,
  templateUrl: './dbs.main.view.html',
})
export class DbsMainView  implements OnInit {
  dbs: DbviewDto[] = [];

  constructor(private dbService: DbsService) { }
  ngOnInit(): void {
    this.getdbs();
  }

  getdbs(): DbviewDto[] {
    this.dbService.getDbs().subscribe(dbs => this.dbs = dbs);
    console.log(this.dbs)
    return this.dbs;
  }

}
