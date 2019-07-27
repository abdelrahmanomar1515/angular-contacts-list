import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss'],
})
export class AddContactComponent {
  contactForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.contactForm = fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      countryCode: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submitForm() {
    console.log(this.contactForm)
  }

}
