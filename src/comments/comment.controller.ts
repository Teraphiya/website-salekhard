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
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentBody } from './comment.types';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { AuthGuard } from '../auth/auth.guard';


@ApiTags('comments')
@ApiBearerAuth()
@Controller('/photo')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  @UseGuards(new AuthGuard())
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment successfully created.',
    type: CreateCommentBody,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() data: CreateCommentBody) {
    const comment = await this.commentService.create(data);
    return comment;
  }
  
  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'Comments found.' })
  @ApiResponse({ status: 404, description: 'No comments found.' })
  async findAll() {
    return await this.commentService.searchMany();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a comment by id' })
  @ApiResponse({ status: 200, description: 'Comment found.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The id of the comment',
  })
  async getComment(@Param('id') id: number) {
    const comment = await this.commentService.searchOne(id);
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    return comment;
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The id of the comment to delete',
  })
  async deleteComment(@Param('id') id: number) {
    const deleteResult = await this.commentService.removeById(id);
    if (!deleteResult.affected) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND); // notfound ex
    }
    return { message: 'Comment deleted successfully' };
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a comment by id' })
  @ApiResponse({ status: 200, description: 'Comment successfully updated.' }) // добавить тип
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateComment(
    @Param('id') id: number,
    @Body() data: CreateCommentBody,
  ) {
    const comment = await this.commentService.update(id, data);
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    return comment;
  }
}