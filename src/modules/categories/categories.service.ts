import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/shared/modules/users/users.service';
import { UniqueConstraintException } from 'src/shared/exceptions/unique-constraint.exception';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    private usersService: UsersService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    // check for a category with the input title
    const categoryTitleExists = await this.categoryRepo.count({
      where: { title: createCategoryDto.title, user: { id: userId } },
    });
    // if count is larger than 0, it means the category already exists
    if (categoryTitleExists > 0)
      throw new UniqueConstraintException(
        'A category with this title already exists.',
      );
    //  query the current user by id to assign to the category
    const user = await this.usersService.findOne(userId);
    // create the new category
    const newCategory = await this.categoryRepo.create({
      ...createCategoryDto,
      user,
    });
    return await this.categoryRepo.save(newCategory);
  }

  async findAll(userId: number) {
    return await this.categoryRepo.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number) {
    const category = await this.categoryRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!category) throw new NotFoundException('Category not found.');
    return category;
  }

  async update(
    id: number,
    userId: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryRepo.update(
      { id, user: { id: userId } },
      { ...updateCategoryDto },
    );
  }

  async remove(id: number, userId: number) {
    return await this.categoryRepo.delete({ id, user: { id: userId } });
  }
}
