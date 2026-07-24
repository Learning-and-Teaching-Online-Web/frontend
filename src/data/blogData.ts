export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  author: string;
  commentsCount: number;
  category: string;
  imageType: 'globe' | 'classroom' | 'office' | 'tablet' | 'child' | 'library';
  tags: string[];
}

export interface BlogCategory {
  name: string;
  count: number;
}

export interface RecentPost {
  id: string;
  title: string;
  date: string;
  imageType: 'globe' | 'classroom' | 'office';
}

export interface BlogComment {
  id: string;
  authorName: string;
  date: string;
  content: string;
  avatarUrl: string;
}

export const mockCategories: BlogCategory[] = [];
export const mockTags: string[] = [];
export const mockRecentPosts: RecentPost[] = [];
export const mockComments: BlogComment[] = [];
export const mockArticles: Article[] = [];
