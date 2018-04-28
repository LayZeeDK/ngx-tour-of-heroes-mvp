export class MessagesPresenter {
  get hasMessages(): boolean {
    return this.messages.length > 0;
  }
  messages: string[] = [];
}
