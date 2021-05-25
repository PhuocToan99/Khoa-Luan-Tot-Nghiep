export class Comment {
    commentId: Int32Array;
    commentContent: string;
    rating: number;
    datePost: string;
    type: string;
    accountId: Int32Array;
    courseId: Int32Array;
    lessonId: Int32Array;
    // commentId: Int32Array;
    // commentContent: string;
    // rating: number;
    // datePost: string;
    // type: string;
    // accountId: string;
    // courseId: string;
    // lessonId: string;
}
export class SubComment {
    subCommentId: Int32Array;
    subCommentContent: string;
    subRating: number;
    subDatePost: string;
    isLiked: boolean;
    parentCommentId: Int32Array;
}
