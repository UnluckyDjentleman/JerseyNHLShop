import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { TeamService } from './team.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { TeamDTO } from './dto';

@Controller('team')
export class TeamController {
    constructor(private teamService:TeamService){}
    @Get("all-teams")
    getAllTeams(){
        return this.teamService.getAllTeams()
    }

    @Get('all-teams/:id')
    getTeamById(@Param('id')id: number){
        return this.teamService.getTeamById(id);
    }

    /*@Post()
    @UseInterceptors(FileInterceptor('teamlogo'))
    postTeam(@Body() dto: TeamDTO, @UploadedFile() file){
        return this.teamService.addTeam(dto,file.filename)
    }*/
}
