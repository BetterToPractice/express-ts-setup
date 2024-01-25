import { Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { RequestQueryParser } from '../../libs/query-parser';
import { BlogService } from '../services/BlogService';
import { PostCreateRequest, PostUpdateRequest } from '../requests/PostRequest';

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

  @Post('/posts')
  async create(@Body() post: PostCreateRequest) {
    return this.blogService.createPost(post);
  }

  @Patch('/posts/:id')
  async update(@Param('id') id: number, @Body() post: PostUpdateRequest) {
    return this.blogService.updatePostById(id, post);
  }

  @Delete('/posts/:id')
  @HttpCode(204)
  async destroy(@Param('id') id: number) {
    return this.blogService.deletePostById(id);
  }
}
