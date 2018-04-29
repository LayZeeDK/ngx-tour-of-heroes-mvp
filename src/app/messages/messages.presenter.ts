import { MessagesComponent } from './messages.component';

export class MessagesPresenter {
  private component: MessagesComponent;
  get hasMessages(): boolean {
    return this.component.messages.length > 0;
  }

  onInitialize(component: MessagesComponent): void {
    this.component = component;
  }
}
