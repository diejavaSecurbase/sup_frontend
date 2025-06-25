import { XFSMessageTypeEnum } from './XFSMessageTypeEnum';
import { XFSValueFormatEnum } from './XFSValueFormatEnum';

export interface XFSMessage {
  type: XFSMessageTypeEnum;
  format: XFSValueFormatEnum;
  value: string;
}
