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
    typeCode: string;
    stateCode: string;
    stageCode: string;
    photoMini: string;
    isMiddleman: boolean;
}
