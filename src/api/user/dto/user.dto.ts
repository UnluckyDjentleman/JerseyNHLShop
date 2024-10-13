import { IsNotEmpty, IsString } from "class-validator";

export class UserDTO{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    surname: string
}