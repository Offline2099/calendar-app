import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MonthBlockComponent } from './month-block/month-block.component';
import { YearBlockComponent } from './year-block/year-block.component';
import { YearPickerComponent } from './year-picker/year-picker.component';
import { HeaderBlockComponent } from './header-block/header-block.component';
import { InfoBlockComponent } from './info-block/info-block.component';

@NgModule({
  declarations: [
    AppComponent,
    MonthBlockComponent,
    YearBlockComponent,
    YearPickerComponent,
    HeaderBlockComponent,
    InfoBlockComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
