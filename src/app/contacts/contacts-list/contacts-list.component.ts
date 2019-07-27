import { AfterViewInit, Component, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { combineLatest, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from "rxjs/operators";
import { ContactsService } from '../contacts.service';
import { Contact } from '../models/contact';
@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements AfterViewInit {

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


    this.vm$ = combineLatest(this.contactsService.contacts$, this.terms$, this.contactsService.latestContacts$)
      .pipe(map(([contacts, term, latestContacts]) => {
        return {
          contacts: this.addIndicesToContacts(this.filterContacts(contacts, term)),
          term,
          latestContacts: this.filterContacts(latestContacts, term)
        };
      })
      );
  }

  // Helper function used to delete the keys that have null as a value, so that when you search null you don't get those results.
  private filterObject(obj) {
    let newObj = { ...obj };
    for (let key in obj) {
      if (obj[key] == null) {
        delete obj[key];
      }
    }
    return newObj;
  };

  private filterContacts(contacts, term): Contact[] {
    return contacts.map(this.filterObject).filter(contact => {
      return JSON.stringify(Object.values(contact)).toLowerCase().includes(term && term.toLowerCase());
    });
  }

  private addIndicesToContacts(contacts: Contact[]): Contact[] {
    let labelledContactsList = [];
    let firstLetter = "";
    for (let i in contacts) {
      // Marking a letter only if first name for contact exists
      let currentLetter = contacts[i].firstName && contacts[i].firstName[0].toUpperCase();
      if (currentLetter !== firstLetter) {
        firstLetter = currentLetter;
        labelledContactsList.push({ index: firstLetter });
      }
      labelledContactsList.push(contacts[i]);
    }
    return labelledContactsList;
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
    return item.firstName && nextItem && (nextItem.firstName || nextItem.lastName);
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
