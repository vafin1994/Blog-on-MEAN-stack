import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {PostsService} from '../posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from '../post.model';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    private mode = 'create';
    private postId: string;
    post: Post;

    constructor(
        private postsService: PostsService,
        public route: ActivatedRoute,
    ) {
    }

    onSavePost(form: NgForm) {
        if (form.invalid) {
            return;
        }
        if (this.mode === 'create') {
            this.postsService.addPost(form.value.title, form.value.content);
            form.resetForm();
        } else if (this.mode === 'edit') {
            this.postsService.updatePost(this.postId, form.value.title, form.value.content);
            form.resetForm();
        } else {
            console.log('Unknown mode');
        }

    }

    ngOnInit() {
        this.route.paramMap.subscribe(
            (paramMap: ParamMap) => {
                if (paramMap.has('postId')) {
                    console.log(paramMap);
                    this.mode = 'edit';
                    this.postId = paramMap.get('postId');
                    this.post = this.postsService.getPost(this.postId);
                } else {
                    this.mode = 'create';
                    this.postId = null;
                }
            }
        );
    }

}
