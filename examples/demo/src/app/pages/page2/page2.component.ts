//create time:Tue Jun 13 2017 13:39:00 GMT+0800 (中国标准时间)
import { Component,OnInit } from '@angular/core';
import lol from 'lol2';
import { Data } from '../../models/data';
@Component({
    selector: 'page2',
    templateUrl: './page2.component.html',
    styleUrls: ['./page2.component.scss']
})
export  class Page2Component implements OnInit  {
    data: Data;
    constructor() {
      this.data = lol.select('data');
    }
    ngOnInit() {

    }
}
