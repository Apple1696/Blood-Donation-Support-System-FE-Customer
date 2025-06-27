import api from '../config/api';
import { useQuery } from '@tanstack/react-query';

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
  tags: string[];
  status: 'published' | 'draft';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data: {
    data: Blog[];
    meta: PaginationMeta;
  };
}

export interface SingleBlogResponse {
  success: boolean;
  message: string;
  data: Blog;
}

// Direct blog response type for endpoints that return the blog object directly
export type DirectBlogResponse = Blog;

/**
 * Fetch blog posts with pagination
 * @param page Page number (default: 1)
 * @param limit Number of items per page (default: 10)
 * @returns BlogResponse with blog posts and pagination metadata
 */
export const getBlogs = async (page: number = 1, limit: number = 10): Promise<BlogResponse> => {
  const response = await api.get<BlogResponse>(`/blog?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Fetch a single blog post by its slug
 * @param slug The blog post slug
 * @returns Blog data
 */
export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  try {
    const response = await api.get<SingleBlogResponse>(`/blog/slug/${slug}`);
    
    // Return the blog data from the response
    if (response.data && response.data.success && response.data.data) {
      // Ensure date fields are valid
      const blog = response.data.data;
      if (blog.publishedAt) {
        // Check if the date is valid
        const publishedDate = new Date(blog.publishedAt);
        if (isNaN(publishedDate.getTime())) {
          // Set a default date if the date is invalid
          blog.publishedAt = new Date().toISOString();
        }
      }
      return blog;
    }
    throw new Error("Invalid blog data received");
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    throw error;
  }
};

/**
 * React Query hook to fetch blog posts with pagination
 * @param page Page number (default: 1)
 * @param limit Number of items per page (default: 10)
 */
export const useGetBlogs = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['blogs', page, limit],
    queryFn: () => getBlogs(page, limit),
  });
};

/**
 * React Query hook to fetch a single blog post by its slug
 * @param slug The blog post slug
 */
export const useGetBlogBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => getBlogBySlug(slug),
    enabled: !!slug,
  });
};