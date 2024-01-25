import { Get, JsonController, Param, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { RequestQueryParser } from '../../libs/query-parser';
import { BlogService } from '../services/BlogService';

@Service()
@JsonController('/blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get('/posts')
  async list(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();
    return this.blogService.getAllPosts(resourceOptions);
  }

  @Get('/posts/:id')
  async detail(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();
    return this.blogService.getPostById(id, resourceOptions);
  }
}
