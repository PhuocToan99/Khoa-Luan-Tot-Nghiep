import { User } from "./user";

export class Comment {
    commentId: Int32Array;
    commentContent: string;
    rating: number;
    datePost: string;
    type: string;
    likeCount:number;
    isLiked: boolean;
    user: User;
    userId: Int32Array;
    courseId: Int32Array;
    lessonId: Int32Array;
}
export class SubComment {
    subCommentId: Int32Array;
    subCommentContent: string;
    subDatePost: string;
    isLiked: boolean;
    likeCount:number;
    user: User;
    userId: Int32Array;
    parentCommentId: Int32Array;
}
