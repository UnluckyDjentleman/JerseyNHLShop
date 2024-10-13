import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeamDTO } from './dto/team.dto';

@Injectable()
export class TeamService {
    constructor(private prisma: PrismaService){}

    async getAllTeams(){
        return await this.prisma.teams.findMany({
            orderBy:[
                {
                    teamname: 'asc',
                }
            ]
        });
    }

    async getTeamById(id: number){
        return await this.prisma.teams.findUnique({
            where:{
                id
            }
        });
    }

    /*async addTeam(dto: TeamDTO, filepath: string){
        const findTeamByName=await this.prisma.teams.findFirst({
            where:{
                teamname: dto.teamname
            }
        })
        if(findTeamByName){
            throw new ConflictException('Such team already exists');
        }
        const teamAdded=this.prisma.teams.create({
            data:{
                teamname: dto.teamname,
                teamlogo: filepath
            }
        }) 
        return teamAdded; 
    }*/
}
