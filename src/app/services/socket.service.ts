import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.backendUrl);
  }

  joinUserRoom(userId: string): void {
    this.socket.emit('join', userId);
  }

  onNewComment(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('new-comment', data => observer.next(data));
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
