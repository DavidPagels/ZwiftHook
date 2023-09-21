export interface Process {
    cntThreads: number;
    szExeFile: string;
    th32ProcessID: number;
    th32ParentProcessID: number;
    pcPriClassBase: number;
}

export interface OpenedProcess extends Process {
    dwSize: number;
    handle: number;
    modBaseAddr: number;
}
