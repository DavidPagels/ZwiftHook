import * as net from 'net';

const FAN_CONFIG = {
    ip: '192.168.2.14',
    port: 9090
};

export default class FanSocket {
    private socket: net.Socket;
    private connectInterval: NodeJS.Timeout | false;

    constructor() {
        this.socket = new net.Socket();
        this.socket.on('connect', () => {
            this.clearConnectInterval()
        })
        
        this.socket.on('error', () => {
            console.log('Connection errored, reopening.');
            this.launchConnectInterval()
        })
        this.socket.on('close', this.launchConnectInterval.bind(this))
        this.socket.on('end', this.launchConnectInterval.bind(this))
    }

    init(): Promise<void> {
        return new Promise(res => {
            this.socket.connect(FAN_CONFIG.port, FAN_CONFIG.ip, () => {
                console.log('Connected to fan.');
                res();
            })
        });
    }

    private launchConnectInterval() {
        if(this.connectInterval) {
            return
        }
        this.connectInterval = setInterval(this.init.bind(this), 5000);
    }
    
    private clearConnectInterval() {
        if(!this.connectInterval) {
            return
        }
        clearInterval(this.connectInterval);
        this.connectInterval = false
    }

    sendData(data: Buffer | string): void {
        this.socket.write(data);
    }
}
