import { ArrowRight, Loader2, Tag } from "lucide-react";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetBlogs } from "@/services/BlogService";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  summary: string;
  published: string;
  url: string;
  image: string;
  tags?: string[];
}

interface Blog8Props {
  heading?: string;
  description?: string;
  posts?: Post[];
}

const Blog = ({
  heading = "Blog Posts",
  description = "Khám phá những thông tin chi tiết và bài viết mới nhất về hiến máu, sức khỏe và các nỗ lực nhân đạo.",
  posts: initialPosts,
}: Blog8Props) => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const { data: blogData, isLoading, error } = useGetBlogs(page, 10);

  useEffect(() => {
    if (blogData?.success && blogData.data.data) {
      // Filter for published blogs only and map to Post format
      const publishedPosts = blogData.data.data
        .filter(blog => blog.status === 'published')
        .map(blog => ({
          id: blog.id,
          title: blog.title,
          summary: blog.excerpt,
          published: format(new Date(blog.publishedAt), 'dd MMM yyyy'),
          url: `/blog/${blog.slug}`,
          image: blog.imageUrl,
          tags: blog.tags,
        }));
      
      setPosts(publishedPosts);
    }
  }, [blogData]);

  return (
    <section className="py-20">
      <div className="container mx-auto flex flex-col items-center gap-16">
        <div className="text-center">
          <h2 className="mx-auto mb-6 text-3xl font-bold text-primary md:text-4xl">
            {heading}
          </h2>

          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading blog posts...</span>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            <p>Failed to load blog posts. Please try again later.</p>
          </div>
        )}

        <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card
                key={post.id}
                className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
              >
                <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                  <div className="sm:col-span-5">
                    <div className="mb-4 md:mb-6">
                      <div className="flex flex-wrap gap-2">
                        {post.tags?.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors hover:bg-secondary/80"
                          >
                            <Tag className="mr-1.5 h-3 w-3 opacity-70" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                      <a
                        href={post.url}
                        className="hover:underline"
                      >
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-4 text-muted-foreground md:mt-5">
                      {post.summary}
                    </p>
                    <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {post.published}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center space-x-2 md:mt-8">
                      <a
                        href={post.url}
                        className="inline-flex items-center font-semibold hover:underline md:text-base"
                      >
                        <span>Xem thêm </span>
                        <ArrowRight className="ml-2 size-4 transition-transform" />
                      </a>
                    </div>
                  </div>
                  <div className="order-first sm:order-last sm:col-span-5">
                    <a href={post.url} className="block">
                      <div className="aspect-16/9 overflow-clip rounded-lg border border-border">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-opacity duration-200 fade-in hover:opacity-70"
                        />
                      </div>
                    </a>
                  </div>
                </div>
              </Card>
            ))
          ) : !isLoading && (
            <div className="col-span-12 text-center py-8">
              <p className="text-muted-foreground">No published blog posts available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Blog };
