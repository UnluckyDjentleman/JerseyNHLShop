import { IsString, IsNotEmpty } from 'class-validator';

export class TeamDTO {
  @IsString()
  teamname: string;
}
