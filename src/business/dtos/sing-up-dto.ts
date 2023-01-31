import { IsEmail, IsNumberString, IsUUID, IsString } from 'class-validator';
export class SingUpDTO {
    @IsString()
    documentTypeId: string;

    @IsNumberString()
    document: string;

    @IsString()
    fullName: string;

    @IsEmail()
    email: string;

    @IsNumberString()
    phone: string;

    @IsString()
    password: string;
}