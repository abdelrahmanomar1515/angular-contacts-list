import { AfterViewInit, Component, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { fromEvent, Observable, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from "rxjs/operators";
import { ContactsService } from '../contacts.service';
import { Contact } from '../models/contact';
import { ContactsListItemComponent } from './contacts-list-item/contacts-list-item.component';
@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements AfterViewInit {

  contacts$: Observable<Contact[]> = this.contactsService.getContacts().pipe(map((res: any) => res.data));
  terms$: Observable<any>;
  vm$: any;
  alphabet: string[] = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('');

  @ViewChild('input', { static: true }) searchInput: ElementRef;
  @ViewChildren('alphabet') listIndices;
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
      return newObj;
    };
    this.vm$ = combineLatest(this.contacts$, this.terms$)
      .pipe(map(([contacts, term]) => {
        const filteredContacts: Contact[] = contacts.map(filterObject).filter(contact => {
          return JSON.stringify(contact).toLowerCase().includes(term && term.toLowerCase());
        });

        let labelledContactsList = [];
        let firstLetter = "";
        for (let i in filteredContacts) {
          // Marking a letter only if first name for contact exists
          let currentLetter = filteredContacts[i].firstName && filteredContacts[i].firstName[0].toUpperCase();
          if (currentLetter !== firstLetter) {
            firstLetter = currentLetter;
            labelledContactsList.push({ index: firstLetter });
          }
          labelledContactsList.push(filteredContacts[i]);
        }
        return { contacts: labelledContactsList, term };
      })
      );
  }


  getContactName(contact: Contact) {
    return (contact.firstName || '') + ' ' + (contact.lastName || '');
  }

  getContactInfo(contact: Contact) {
    return contact.mobileNumber || contact.email;
  }

  shouldAddDivider(index: number, contacts) {
    let item = contacts[index];
    let nextItem = contacts[index + 1];
    return item.firstName && (nextItem.firstName || nextItem.lastName);
  }
  goToItem(index: number) {
    let elToGoTo;
    while (!elToGoTo) {
      elToGoTo = this.listIndices.find(el => el.nativeElement.id === this.alphabet[index]);
      index--;
    }
    elToGoTo.nativeElement.scrollIntoView();
  }
}
