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

export const mockCategories: BlogCategory[] = [
  { name: 'Commercial', count: 15 },
  { name: 'Office', count: 15 },
  { name: 'Shop', count: 15 },
  { name: 'Educate', count: 15 },
  { name: 'Academy', count: 15 },
  { name: 'Single family home', count: 15 },
];

export const mockTags: string[] = [
  'Free courses',
  'Marketing',
  'Idea',
  'LMS',
  'LearnPress',
  'Instructor'
];

export const mockRecentPosts: RecentPost[] = [
  {
    id: 'post-1',
    title: 'Best LearnPress WordPress Theme Collection For 2023',
    date: 'Jan 24, 2023',
    imageType: 'globe'
  },
  {
    id: 'post-2',
    title: 'Best LearnPress WordPress Theme Collection For 2023',
    date: 'Jan 24, 2023',
    imageType: 'classroom'
  },
  {
    id: 'post-3',
    title: 'Best LearnPress WordPress Theme Collection For 2023',
    date: 'Jan 24, 2023',
    imageType: 'office'
  }
];

export const mockComments: BlogComment[] = [
  {
    id: 'comment-1',
    authorName: 'Laura Hipster',
    date: 'October 03, 2022',
    content: 'Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel enim eu turpis imperdiet.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 'comment-2',
    authorName: 'Laura Hipster',
    date: 'October 03, 2022',
    content: 'Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  },
  {
    id: 'comment-3',
    authorName: 'Laura Hipster',
    date: 'October 03, 2022',
    content: 'Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel enim eu turpis imperdiet.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  }
];

export const mockArticles: Article[] = [
  {
    id: 'post-1',
    title: 'Best LearnPress WordPress Theme Collection For 2023',
    excerpt: 'Looking for an amazing & well-functional LearnPress WordPress Theme?...',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel enim eu turpis imperdiet.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus.'
    ],
    date: 'Jan 24, 2023',
    author: 'Determined-poitras',
    commentsCount: 20,
    category: 'Educate',
    imageType: 'globe',
    tags: ['Free courses', 'Marketing', 'LMS', 'LearnPress']
  },
  {
    id: 'post-2',
    title: 'Best LearnPress WordPress Theme Collection For 2023',
    excerpt: 'Looking for an amazing & well-functional LearnPress WordPress Theme?...',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel enim eu turpis imperdiet.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus.'
    ],
    date: 'Jan 24, 2023',
    author: 'Determined-poitras',
    commentsCount: 20,
    category: 'Commercial',
    imageType: 'classroom',
    tags: ['Idea', 'LMS', 'Instructor']
  },
  {
    id: 'post-3',
    title: 'Best LearnPress WordPress Theme Collection For 2023',
    excerpt: 'Looking for an amazing & well-functional LearnPress WordPress Theme?...',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel enim eu turpis imperdiet.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus.'
    ],
    date: 'Jan 24, 2023',
    author: 'Determined-poitras',
    commentsCount: 20,
    category: 'Office',
    imageType: 'office',
    tags: ['Free courses', 'Marketing', 'Instructor']
  },
  {
    id: 'post-4',
    title: 'Best LearnPress WordPress Theme Collection For 2023',
    excerpt: 'Looking for an amazing & well-functional LearnPress WordPress Theme?...',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel enim eu turpis imperdiet.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus.'
    ],
    date: 'Jan 24, 2023',
    author: 'Determined-poitras',
    commentsCount: 20,
    category: 'Shop',
    imageType: 'tablet',
    tags: ['Marketing', 'Idea', 'LearnPress']
  },
  {
    id: 'post-5',
    title: 'Best LearnPress WordPress Theme Collection For 2023',
    excerpt: 'Looking for an amazing & well-functional LearnPress WordPress Theme?...',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel enim eu turpis imperdiet.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus.'
    ],
    date: 'Jan 24, 2023',
    author: 'Determined-poitras',
    commentsCount: 20,
    category: 'Academy',
    imageType: 'child',
    tags: ['Free courses', 'LMS', 'LearnPress']
  },
  {
    id: 'post-6',
    title: 'Best LearnPress WordPress Theme Collection For 2023',
    excerpt: 'Looking for an amazing & well-functional LearnPress WordPress Theme?...',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel enim eu turpis imperdiet.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus.'
    ],
    date: 'Jan 24, 2023',
    author: 'Determined-poitras',
    commentsCount: 20,
    category: 'Single family home',
    imageType: 'library',
    tags: ['Idea', 'Instructor']
  }
];
