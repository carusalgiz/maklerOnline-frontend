export class UploadFile {
    name: string;
    fileName: string;
    ext: string;
    href: string;
    hrefMini: string;
    addDate: number;
    type: number;
    isTemp: boolean;
    userId: number;

    constructor(
        href? : string
    ) {
        this.href = href;
    }
}
