import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { CreateAttractionBody } from './attraction.types';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('attractions')
@Controller('/attraction')
export class AttractionController {
  constructor(private readonly attractionService: AttractionService) {}

  @Post('creat')
  @ApiOperation({ summary: 'Create a new attraction' })
  @ApiResponse({
    status: 201,
    description: 'Attraction successfully created.',
    type: CreateAttractionBody,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() data: CreateAttractionBody) {
    const attraction = await this.attractionService.create(data);
    return attraction;
  }

  @Get()
  @ApiOperation({ summary: 'Get all attractions' })
  @ApiResponse({ status: 200, description: 'Attractions found.' })
  @ApiResponse({ status: 404, description: 'No attractions found.' })
  async findAll() {
    const attractions = await this.attractionService.searchMany();
    if (attractions.length === 0) {
      throw new HttpException('No attractions found', HttpStatus.NOT_FOUND);
    }
    return attractions;
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get an attraction by id' })
  @ApiResponse({ status: 200, description: 'Attraction found.' })
  @ApiResponse({ status: 404, description: 'Attraction not found.' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The id of the attraction',
  })
  async getAttraction(@Param('id') id: number) {
    const attraction = await this.attractionService.searchOne(id);
    if (!attraction) {
      throw new HttpException('Attraction not found', HttpStatus.NOT_FOUND);
    }
    return attraction;
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete an attraction' })
  @ApiResponse({ status: 200, description: 'Attraction deleted.' })
  @ApiResponse({ status: 404, description: 'Attraction not found.' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The id of the attraction to delete',
  })
  async deleteAttraction(@Param('id') id: number) {
    const deleteResult = await this.attractionService.removeById(id);
    if (!deleteResult.affected) {
      throw new HttpException('Attraction not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Attraction deleted successfully' };
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update an attraction by id' })
  @ApiResponse({ status: 200, description: 'Attraction successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async updateAttraction(
    @Param('id') id: number,
    @Body() data: CreateAttractionBody,
  ) {
    const attraction = await this.attractionService.update(id, data);
    if (!attraction) {
      throw new HttpException('Attraction not found', HttpStatus.NOT_FOUND);
    }
    return attraction;
  }
}
