import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    postSubscribtion: Subscription;
    constructor(private postsService: PostsService) {}
    ngOnInit() {
        this.postsService.getPosts();
        this.postSubscribtion = this.postsService.getPostUpdateListener().subscribe(
            (posts: Post[]) => {
                this.posts = posts;
            });
    }
    ngOnDestroy() {
        this.postSubscribtion.unsubscribe();
    }
    deletePost(postId: string) {
        this.postsService.deletePost(postId);
    }

}
