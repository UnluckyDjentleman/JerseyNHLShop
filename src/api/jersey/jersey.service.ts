import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JerseyDTO } from './dto';

@Injectable()
export class JerseyService {
  constructor(private prisma: PrismaService) {}

  async getJerseys() {
    return await this.prisma.jerseys.findMany();
  }

  async getJerseysByTeamId(id: number) {
    return await this.prisma.jerseys.findMany({
      where: {
        teamid: id,
      },
    });
  }
  async getJerseyById(id: number) {
    return await this.prisma.jerseys.findUnique({
      where: {
        id,
      },
    });
  }
  async addNewJersey(dto: JerseyDTO, filepath: string) {
    const { jerseyTitle, jerseyDescription, size, teamId, cost } = dto;
    const existingJersey = await this.prisma.jerseys.findFirst({
      where: {
        jerseytitle: jerseyTitle,
        jerseyimage: filepath,
        size: size,
      },
    });
    if (existingJersey) {
      throw new ConflictException('Such jersey already exists');
    }
    const addedJersey = await this.prisma.jerseys.create({
      data: {
        jerseytitle: jerseyTitle,
        jerseydescription: jerseyDescription,
        teamid: teamId,
        size: size,
        jerseyimage: filepath,
        cost: cost,
      },
    });
    return addedJersey;
  }

  async updateJersey(dto: JerseyDTO, id: number, filepath: string) {
    const { jerseyTitle, jerseyDescription, size, cost } = dto;
    const jerseyToUpdate = await this.prisma.jerseys.findUnique({
      where: {
        id,
      },
    });
    if (!jerseyToUpdate) {
      throw new NotFoundException("Such jersey doesn't exist");
    }
    const updatedJersey = await this.prisma.jerseys.update({
      where: {
        id,
      },
      data: {
        jerseytitle: jerseyTitle,
        jerseydescription: jerseyDescription,
        size: size,
        jerseyimage: filepath,
        cost: cost,
      },
    });
    return updatedJersey;
  }
  async deleteJersey(id: number) {
    console.log('ID:' + id);
    const deletedJersey = await this.prisma.jerseys.delete({
      where: {
        id,
      },
    });
    return deletedJersey;
  }
}
