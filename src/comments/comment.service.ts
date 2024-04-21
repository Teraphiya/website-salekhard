import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Comment } from './comment.model';
import { CreateCommentBody } from './comment.types';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(data: CreateCommentBody) {
    return await this.commentRepository.save(
      this.commentRepository.create(data),
    );
  }

  async searchOne(id: number) {
    return await this.commentRepository.findOne({ where: { id } });
  }

  async searchMany() {
    return await this.commentRepository.find();
  }

  async removeById(id: number) {
    return await this.commentRepository.delete(id);
  }

  async update(id: number, data: CreateCommentBody) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      return null;
    }
    comment.name = data.name;
    comment.email = data.email;
    comment.content = data.content;
    return await this.commentRepository.save(comment);
  }
}
