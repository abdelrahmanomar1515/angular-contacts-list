import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from './models/contact';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  contacts: BehaviorSubject<Contact[]> = new BehaviorSubject([]);
  contacts$: Observable<Contact[]> = this.contacts.asObservable();

  constructor(public http: HttpClient) {
    this.getContacts().pipe(
      map((res: any) => res.data)
    ).subscribe((contacts: Contact[]) => {
      contacts = contacts.filter(contact => contact.firstName || contact.lastName || contact.mobileNumber || contact.email)
      this.contacts.next(contacts);
    });
  }

  private getContacts() {
    return this.http.get("data/contacts.json");
  }

  public addContact(newContact: Contact) {
    let contacts: Contact[] = this.contacts.getValue();
    let index;

    // Insert contact in right place
    for (let i in contacts) {
      if (contacts[i] && contacts[i].firstName) {
        if (newContact.firstName.toLowerCase() < contacts[i].firstName.toLowerCase()) {
          index = i;
          break;
        }
      }
      index = i + 1; // Fallback to adding at the end of the array
    }

    let newContactList = [...contacts.slice(0, index), newContact, ...contacts.slice(index)]
    this.contacts.next(newContactList);
  }

}
