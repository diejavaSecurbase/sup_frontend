
export enum XfsApiCallId {
  scanFingerprint,
  cancelScanFingerprint,
  scanFingerprintPresent,
  exchangeCassettes,
  executeCashDispense,
  getInfoCashDispenser,
  retractCashdispense,
  validateCashdispense,
  printJournal,
  printReceipt
}

export class XfsApiUtils {

  // private mapId: Map<XfsApiCallId,string> = new Map();

  public constructor() {
    // return 'exceptionToken';
    // return 'errorToken';
    // return 'nodeviceToken';
    // this.mapId[XfsApiCallId.scanFingerprint] = '';
  }

  public buildAuditToken(id:XfsApiCallId) {
    return Math.random().toString(18).substring(2);
  }
}

export const xfsApiUtils = new XfsApiUtils();