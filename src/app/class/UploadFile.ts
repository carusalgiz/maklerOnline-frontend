export class UploadFile {
    name: string;
    fullName: string;
    ext: string;
    href: string;
    hrefMini: string;
    addDate: number;
    type: number;
    isTemp: boolean;

    constructor(
        href? : string
    ) {
        this.href = href;
    }
}
