import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-contacts-list-item',
  templateUrl: './contacts-list-item.component.html',
  styleUrls: ['./contacts-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsListItemComponent implements OnInit {

  @Input() imageSource: string;
  @Input() contactName: string;
  @Input() contactInfo: string;
  constructor() { }

  ngOnInit() {
  }

}
