import { jerseys } from '@prisma/client';
import {IsString, IsNotEmpty, IsInt, Min, Max} from 'class-validator'

export class OrderDTO{
    @IsInt()
    jerseySize: number;

    @IsString()
    userLastName: string;

    @IsInt()
    
    jerseyNumber: number;

    @IsInt()
    count: number;

    @IsInt()
    jerseyid: number
}