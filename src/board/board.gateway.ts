import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BoardService } from './board.service';

@WebSocketGateway({ cors: true })
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  constructor(private readonly boardService: BoardService) {}

  handleConnection(client: Socket) {
    console.log('Conectado ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Desconectado ', client.id);
  }

  @SubscribeMessage('init')
  async onInit(client: Socket, payload) {
    client.join(payload.matchId);
    const info = await this.boardService.getMatchInfo(payload.matchId);
    const homePlayersFaults = [{}];
    info.homePlayers.forEach((player) => (homePlayersFaults[0][player.id] = 0));
    const awayPlayersFaults = [{}];
    info.awayPlayers.forEach((player) => (awayPlayersFaults[0][player.id] = 0));
    const homePlayersPoints = {};
    info.homePlayers.forEach((player) => (homePlayersPoints[player.id] = 0));
    const awayPlayersPoints = {};
    info.awayPlayers.forEach((player) => (awayPlayersPoints[player.id] = 0));
    client.emit('init-from-server', {
      matchInfo: {
        ...info,
        period: 1,
        homePoints: 0,
        awayPoints: 0,
        activeHomePlayers: info.homePlayers.slice(0, 5),
        activeAwayPlayers: info.awayPlayers.slice(0, 5),
        homePlayersFaults,
        awayPlayersFaults,
        homePlayersPoints,
        awayPlayersPoints,
        direction: 'none',
      },
    });
  }
  @SubscribeMessage('join')
  onJoin(client: Socket, payload) {
    client.join(payload.matchId);
    this.wss.to(payload.matchId).emit('new-spectator', {
      id: client.id,
    });
  }

  @SubscribeMessage('welcome')
  onInfo(client: Socket, payload) {
    this.wss.to(payload.id).emit('state', { state: payload.state });
  }

  @SubscribeMessage('update')
  onUpdate(client: Socket, payload) {
    this.wss.to([...client.rooms][1]).emit('update', payload);
  }

  @SubscribeMessage('stopClock')
  onStop(client: Socket, payload) {
    this.wss.to([...client.rooms][1]).emit('stopClock', payload);
  }

  @SubscribeMessage('startClock')
  onStart(client: Socket, payload) {
    this.wss.to([...client.rooms][1]).emit('startClock', payload);
  }

  @SubscribeMessage('resetClock')
  onReset(client: Socket, payload) {
    this.wss.to([...client.rooms][1]).emit('resetClock', payload);
  }
  //Short

  @SubscribeMessage('joinShort')
  onJoinShort(client: Socket, payload) {
    client.join(payload.matchId);
  }

  @SubscribeMessage('stopShort')
  onStopShort(client: Socket, payload) {
    console.log('stopShort', payload);
    this.wss.to([...client.rooms][1]).emit('stopShort', payload);
  }

  @SubscribeMessage('resetShort')
  onResetShort(client: Socket, payload) {
    this.wss.to([...client.rooms][1]).emit('resetShort', payload);
  }

  @SubscribeMessage('startShort')
  onStartShort(client: Socket, payload) {
    this.wss.to([...client.rooms][1]).emit('startShort', payload);
  }

  @SubscribeMessage('playBuzzer')
  onPlayBuzzer(client: Socket, payload) {
    this.wss.to([...client.rooms][1]).emit('buzzer', payload);
  }

  @SubscribeMessage('saveMatch')
  onSaveMatch(client: Socket, payload) {
    this.boardService
      .saveMatch(payload)
      .then((success) =>
        this.wss.to([...client.rooms][1]).emit('saved', { success }),
      );
  }
}
