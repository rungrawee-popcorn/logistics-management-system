import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TrackingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Tracking Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Tracking Client Disconnected: ${client.id}`);
  }

  broadcastLocation(payload: {
    riderId: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
  }) {
    this.server.emit('rider-location-updated', payload);
  }
}
