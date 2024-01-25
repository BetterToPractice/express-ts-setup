import { Get, JsonController, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { RequestQueryParser } from '../../libs/query-parser';
import { BlogService } from '../services/BlogService';

@Service()
@JsonController('/blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get('/posts')
  async index(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();
    return this.blogService.getAllPosts(resourceOptions);
  }

  @Get('/:id')
  detail() {
    return 'awesome';
  }
}
