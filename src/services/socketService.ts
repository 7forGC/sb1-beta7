import { io, Socket } from 'socket.io-client';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

class SocketService {
  private socket: Socket | null = null;
  private signalRConnection: HubConnection | null = null;

  // Initialize Socket.IO connection
  initializeSocketIO(userId: string) {
    this.socket = io('YOUR_SOCKET_SERVER_URL', {
      auth: { userId },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO Connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.IO Disconnected');
    });

    return this.socket;
  }

  // Initialize SignalR connection for video calls
  async initializeSignalR(userId: string) {
    this.signalRConnection = new HubConnectionBuilder()
      .withUrl('YOUR_SIGNALR_HUB_URL')
      .withAutomaticReconnect()
      .build();

    await this.signalRConnection.start();
    await this.signalRConnection.invoke('RegisterUser', userId);

    return this.signalRConnection;
  }

  // Clean up connections
  cleanup() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.signalRConnection) {
      this.signalRConnection.stop();
      this.signalRConnection = null;
    }
  }
}

export const socketService = new SocketService();