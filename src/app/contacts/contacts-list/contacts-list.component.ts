import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, Observable, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from "rxjs/operators";
import { ContactsService } from '../contacts.service';
import { Contact } from '../models/contact';
@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements AfterViewInit {

  contacts$: Observable<Contact[]> = this.contactsService.getContacts().pipe(map((res: any) => res.data));
  terms$: Observable<any>;
  vm$: any;

  @ViewChild('input', { static: true }) searchInput: ElementRef;

  constructor(private contactsService: ContactsService) { }

  ngAfterViewInit(): void {
    this.terms$ = fromEvent<any>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(''),
        debounceTime(100),
        distinctUntilChanged()
      );;

    // Helper function used to delete the keys that have null as a value, so that when you search null you don't get those results.
    const filterObject = (obj) => {
      let newObj = { ...obj };
      for (let key in obj) {
        if (obj[key] == null) {
          delete obj[key];
        }
      }
      return newObj
    };
    this.vm$ = combineLatest(this.contacts$, this.terms$)
      .pipe(map(([contacts, term]) => {
        const filteredContacts = contacts.map(filterObject).filter(contact => {
          return JSON.stringify(contact).toLowerCase().includes(term && term.toLowerCase());
        });
        return { contacts: filteredContacts, term };
      })
      );
  }


  getContactName(contact: Contact) {
    return (contact.firstName || '') + ' ' + (contact.lastName || '');
  }

  getContactInfo(contact: Contact) {
    return contact.mobileNumber || contact.email;
  }

}
