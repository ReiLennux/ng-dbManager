export enum BackupType {
    FULL,
    DIFFERENTIAL,
    LOG
}


export class Bkpsform {
    DatabaseName!: string;
    BackupType!: BackupType;
}
