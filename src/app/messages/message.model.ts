export enum MessageType {
  INFO,
  ERROR
}

export interface Message {
  id: number;
  type: MessageType;
  message: string;
}