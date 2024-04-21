import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Attraction } from './attraction.model';
import { CreateAttractionBody } from './attraction.types';

@Injectable()
export class AttractionService {
  constructor(
    @InjectRepository(Attraction)
    private readonly attractionRepository: Repository<Attraction>,
  ) {}

  async create(data: CreateAttractionBody) {
    return await this.attractionRepository.save(
      this.attractionRepository.create(data),
    );
  }

  async searchOne(id: number) {
    return await this.attractionRepository.findOne({ where: { id } });
  }

  async searchMany() {
    return await this.attractionRepository.find();
  }

  async removeById(id: number) {
    return await this.attractionRepository.delete(id);
  }

  async update(id: number, data: CreateAttractionBody) {
    const attraction = await this.attractionRepository.findOne({
      where: { id },
    });
    if (!attraction) {
      return null;
    }
    attraction.name = data.name;
    attraction.location = data.location;
    attraction.foundationYear = data.foundationYear;
    attraction.description = data.description;
    attraction.image = data.image;
    return await this.attractionRepository.save(attraction);
  }
}
