import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

export interface ProgressUpdate {
  type: 'progress' | 'complete' | 'error';
  stage: string;
  message: string;
  progress: number; // 0-100
  data?: any;
}

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocket> = new Map();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);

      console.log(`WebSocket client connected: ${clientId}`);

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          console.log('Received message:', data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`WebSocket client disconnected: ${clientId}`);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(clientId);
      });

      // Send initial connection message
      ws.send(JSON.stringify({
        type: 'connected',
        clientId,
        message: 'Connected to AI Web Analyzer'
      }));
    });
  }

  sendProgress(clientId: string, update: ProgressUpdate) {
    const client = this.clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(update));
    }
  }

  broadcast(update: ProgressUpdate) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(update));
      }
    });
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  close() {
    if (this.wss) {
      this.wss.close();
    }
  }
}

export const websocketService = new WebSocketService();
