export class ScanFingerprintOutput {
    public txId: string;
    public status: ScanFingerprintStatus;
    public wsq: string;
    public errorCode: number;
    public errorDesc: string;
}

export enum ScanFingerprintStatus {
    OK='OK', NO_DEVICE='NO_DEVICE', TIMEOUT='TIMEOUT', ERROR='ERROR', CANCELED='CANCELED'
}