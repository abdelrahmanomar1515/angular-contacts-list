import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ContactsService } from './contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  contacts$ = this.contactsService.getContacts().pipe(map((res: any) => res.data))
  constructor(private contactsService: ContactsService) { }

  ngOnInit() {
  }
}
