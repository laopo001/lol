import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
// import { ROUTES } from './app.router'
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TableModule } from 'jpush-ui/table'

import { Page1Component } from './pages/page1/page1.component'
import { Page2Component } from './pages/page2/page2.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import lol from 'lol2';
import { Data } from './models/data';

window.onbeforeunload = function () {
    localStorage.setItem('data cache', JSON.stringify(lol.getState()))
}
let preState = {};
let cache = localStorage.getItem('data cache');
if (cache != null && cache != "undefined") {
    //    preState = JSON.parse(cache);
}
lol.models(Data).init(preState).onError((e) => {
    if (e && e.message != null) { console.error(e.message) } else {
        console.error(e)
    }
}).run(process.env.NODE_ENV === 'development')


@NgModule({
    imports: [
        BrowserModule,BrowserAnimationsModule, FormsModule, NgZorroAntdModule.forRoot(), TableModule
        // RouterModule.forRoot(ROUTES, {
        //     useHash: true
        // }),
    ],
    declarations: [
        AppComponent, Page1Component, Page2Component,
    ],

    bootstrap: [AppComponent]
})
export class AppModule { }
