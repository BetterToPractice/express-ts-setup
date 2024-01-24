import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';
import AppDataSource from '../../libs/database';
import { Post } from '../../models/Post';

@Service()
@JsonController('/blog')
export class BlogController {
  private postRepository = AppDataSource.getRepository(Post);

  @Get()
  async index() {
    return await this.postRepository.findAndCount();
  }

  @Get('/:id')
  detail() {
    return 'awesome';
  }
}
