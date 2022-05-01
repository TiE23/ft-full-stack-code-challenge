export enum NoticeType {
  SUCCESS = 'Success',
  WARNING = 'Warning',
  ERROR = 'Error',
}

export interface PageNotice {
  type: NoticeType;
  message: string;
}
