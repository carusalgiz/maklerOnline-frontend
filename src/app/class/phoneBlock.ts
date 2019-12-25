export class PhoneBlock {
    office: string;
    home: string;
    cellphone: string;
    fax: string;
    main: string;
    other: string;
    ip: string;

    constructor (
        office?: string,
        home?: string,
        cellphone?: string,
        fax?: string,
        main?: string,
        other?: string,
        ip?: string
    ) {
        this.office = office;
        this.home = home;
        this.cellphone = cellphone;
        this.fax = fax;
        this.main = main;
        this.other = other;
        this.ip = ip;
    }
}
