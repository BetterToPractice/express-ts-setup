import { Service } from 'typedi';
import AppDataSource from '../../libs/database';
import { Post } from '../../models/Post';
import { MainRepository } from '../../libs/query-parser';

@Service()
export class BlogService {
  private postRepository = AppDataSource.getRepository(Post).extend(MainRepository());

  async getAllPosts(resourceOptions?: object) {
    return await this.postRepository.getManyAndCount(resourceOptions);
  }
}
