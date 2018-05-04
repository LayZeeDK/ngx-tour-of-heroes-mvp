import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MessagesPresenter } from './messages.presenter';

@Component({
  selector: 'app-messages-ui',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessagesPresenter],
})
export class MessagesComponent {
  @Input() messages: string[];
  @Input() title: string;
  @Output() clear: EventEmitter<void> = new EventEmitter();

  get hasMessages(): boolean {
    return this.presenter.hasMessages;
  }

  constructor(private presenter: MessagesPresenter) {
    presenter.onInitialize(this);
  }
}
