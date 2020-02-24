import {PhoneBlock} from './phoneBlock';
import {EmailBlock} from './emailBlock';
import {MessengerBlock} from './messengerBlock';
import {SocialBlock} from './socialBlock';
import {Organisation} from './organisation';
import {UploadFile} from './UploadFile';

export class Person {
    id: number;
    accountId: number;
    name: string;
    description: string;
    addDate: number;
    phoneBlock: PhoneBlock;
    emailBlock: EmailBlock;
    socialBlock: SocialBlock;
    messengerBlock: MessengerBlock;
    organisationId: number;
    organisation: Organisation;
    typeCode: string;
    stateCode: string;
    stageCode: string;
    loyalty: string;
    tag: string;
    rate: number;
    sourceCode: number;
    photo: string;
    photoMini: string;
    isMiddleman: boolean;
    type: string;
    photos: UploadFile[];         //url фото
    documents: UploadFile[];
}
