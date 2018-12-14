import { Component, ViewChild, TemplateRef, OnInit, ElementRef } from '@angular/core';
import lol from 'lol2';
import { Data } from '../../models/data';

@Component({
  selector: 'page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.css']
})
export class Page1Component implements OnInit {
  data: Data;
  constructor() {
    this.data = lol.select('data');
  }
  ngOnInit() {
    lol.dispatch({
      type: 'data/get_top', payload: {
        q: `language:javascript`,
        sort: `stars`
      }
    })
  }
  pagination = {
    pageSizeData: [10, 20, 50, 100]
  }
  options = [
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
    { value: 'disabled', label: 'Disabled', disabled: true }
  ];
  delete(id) {
    lol.dispatch({
      type: 'data/delete', payload: id
    })
  }
}
