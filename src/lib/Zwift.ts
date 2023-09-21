import * as memoryjs from 'memoryjs';
import {OpenedProcess} from '../interfaces';

const ZWIFT_PROCESS = 'ZwiftApp.exe';

const POINTER_MAPS = {
    hr: {
        map: [
            0x01CBFD68,
            0x2E0,
            0xB8,
            0x118,
            0x0,
            0xF0,
            0x590,
            0xBC8
        ],
        offset: 0xDA8
    },
    power: {
        map: [],
        offset: 0x00
    }
};


export default class Zwift {
    private zwiftProcess: OpenedProcess;
    public zwiftRunning: boolean;
    private hrPointer: number;
    private powerPointer: number;

    running(): boolean {
        if (this.zwiftRunning) {
            return true;
        }
        
        try {
            this.zwiftProcess = memoryjs.openProcess(ZWIFT_PROCESS);
            this.updatePointer('hr');
            this.updatePointer('power');
            this.zwiftRunning = true;
        } catch (e) {
            console.log('Zwift not open');
        } finally {
            return this.zwiftRunning;
        }
        
    }

    private updatePointer(pointerName: keyof typeof POINTER_MAPS): void {
        this[`${pointerName.toString()}Pointer`] = POINTER_MAPS[pointerName].map.reduce((acc, ptrOff) => {
            acc = memoryjs.readMemory(this.zwiftProcess.handle, acc + ptrOff, memoryjs.UINT64);
            return Number(acc);
        }, this.zwiftProcess.modBaseAddr)
    }

    private getCurrentValue(pointerName: keyof typeof POINTER_MAPS): number {
        const currentVal = memoryjs.readMemory(this.zwiftProcess.handle, this[`${pointerName.toString()}Pointer`] + POINTER_MAPS[pointerName].offset, memoryjs.UINT64);
        return Number(currentVal);
    }

    updateHrPointer(): void {
        this.updatePointer('hr');
    }

    updatePowerPointer(): void {
        this.updatePointer('power');
    }

    getHr(): number {
        return this.getCurrentValue('hr');
    }

    getPower(): number {
        return this.getCurrentValue('power');
    }
}