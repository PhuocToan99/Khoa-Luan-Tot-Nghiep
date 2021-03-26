import { Account } from '../../model/Account';
export interface DialogData {
    userId: Int32Array;
    firstName: string;
    lastName: string;    
    gender: string;
    createdDate: Date;
    lastLogOnDate: Date;
    email: string;
    phoneNumber: string;
    avatarPath: string;
    balance: number;
    account: Account;
  }