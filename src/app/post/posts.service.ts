import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {
    }

    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    getPosts() {
        return this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
                    };
                });
            }))
            .subscribe(
                (dbPosts) => {
                    this.posts = dbPosts;
                    this.postUpdated.next([...this.posts]);
                });
    }

    getPost(id: string) {
        return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
    }

    addPost(title: string, content: string) {
        const post: Post = {id: null, title, content};
        this.http.post<{ message: string, id: string }>('http://localhost:3000/api/posts', post)
            .subscribe(
                (responseData) => {
                    post.id = responseData.id;
                    this.posts.push(post);
                    this.postUpdated.next([...this.posts]);
                    this.router.navigate(['/']);
                });
    }

    updatePost(id: string, title: string, content: string) {
        const post: Post = {id, title, content};
        this.http.put('http://localhost:3000/api/posts/' + id, post).subscribe(
            (response) => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

    deletePost(postId: string) {
        this.http.delete('http://localhost:3000/api/posts/' + postId)
            .subscribe(() => {
                this.posts = this.posts.filter(post => post.id !== postId);
                this.postUpdated.next([...this.posts]);
            });
    }
}
