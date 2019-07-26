import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ContactsListItemComponent } from './contacts-list/contacts-list-item/contacts-list-item.component';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';
import { ContactsService } from './contacts.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    ContactsComponent,
    ContactsListComponent,
    AddContactComponent,
    ContactsListItemComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ContactsRoutingModule
  ],
  providers: [ContactsService]
})
export class ContactsModule { }
