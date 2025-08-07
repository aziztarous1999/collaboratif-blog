export interface Author {
  _id: string;
  username: string;
  role: string;
}

export interface Comment {
  _id: string;
  article: string;
  author: Author;
  content: string;
  parent: string | null;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
}
