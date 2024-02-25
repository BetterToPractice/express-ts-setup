import { Service } from 'typedi';
import AppDataSource from '../../libs/database';
import { Post } from '../../models/Post';
import { MainRepository } from '../../libs/query-parser';
import { PostCreateRequest, PostUpdateRequest } from '../requests/PostRequest';
import { LoggedUserInterface } from '../interfaces/ILoggedInUser';
// import { PostNotFoundError } from '../exceptions/Post';

@Service()
export class BlogService {
  private postRepository = AppDataSource.getRepository(Post).extend(MainRepository());

  async getAllPosts(resourceOptions?: object) {
    return await this.postRepository.getManyAndCount(resourceOptions);
  }

  async getPostById(id: number, resourceOptions?: object) {
    return await this.postRepository.getOneById(id, resourceOptions);
  }

  async createPost(post: PostCreateRequest, loggedInUser: LoggedUserInterface) {
    const entity = new Post();
    Object.assign(entity, post);

    if (loggedInUser) {
      // entity.user_id = loggedInUser.id;
    }

    return await this.postRepository.save(entity);
  }

  async updatePostById(id: number, post: PostUpdateRequest) {
    const entity = await this.postRepository.getOneById(id);
    if (!entity) {
      // throw new PostNotFoundError();
    }
    Object.assign(entity, post);
    return await this.postRepository.save(entity);
  }

  async deletePostById(id: number) {
    return await this.postRepository.delete(id);
  }
}
