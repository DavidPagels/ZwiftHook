import FanSocket from "./lib/FanSocket";
import Zwift from "./lib/Zwift";

async function zwiftClientProcess() {
    const zwift = new Zwift();
    const fanSocket = new FanSocket();
    await fanSocket.init();
    setInterval(() => updateState(zwift, fanSocket), 500);
}

function updateState(zwift: Zwift, fanSocket: FanSocket): void {
    if (!zwift.running()) {
        return;
    }
    const hr = zwift.getHr();
    const fanData = Buffer.alloc(8);
    console.log(hr);
    // Todo: ensure the data is within range (hr < 250, power < 4000)
    fanData.writeUInt32LE(52);
    fanData.writeUInt32LE(400, 4);
    fanSocket.sendData(fanData);
}

zwiftClientProcess();