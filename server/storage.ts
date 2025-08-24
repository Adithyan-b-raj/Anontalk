import { type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  addOnlineUser(sessionId: string): Promise<void>;
  removeOnlineUser(sessionId: string): Promise<void>;
  getOnlineUserCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private messages: Message[];
  private onlineUsers: Set<string>;

  constructor() {
    this.messages = [];
    this.onlineUsers = new Set();
  }

  async getAllMessages(): Promise<Message[]> {
    return [...this.messages].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      content: insertMessage.content,
      timestamp: new Date(),
    };
    this.messages.push(message);
    return message;
  }

  async addOnlineUser(sessionId: string): Promise<void> {
    this.onlineUsers.add(sessionId);
  }

  async removeOnlineUser(sessionId: string): Promise<void> {
    this.onlineUsers.delete(sessionId);
  }

  async getOnlineUserCount(): Promise<number> {
    return this.onlineUsers.size;
  }
}

export const storage = new MemStorage();
