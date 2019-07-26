import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  constructor(public http: HttpClient) { }

  getContacts() {
    return this.http.get("data/contacts.json")
  }

}
