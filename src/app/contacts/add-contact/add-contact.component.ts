import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactsService } from '../contacts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss'],
})
export class AddContactComponent {
  contactForm: FormGroup;

  constructor(
    private contactsService: ContactsService, 
    fb: FormBuilder,
    private router: Router) {
    this.contactForm = fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      countryCode: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submitForm() {
    this.contactsService.addContact(this.contactForm.value)
    console.log(this.contactForm)
    this.router.navigateByUrl('contacts')
  }

}
