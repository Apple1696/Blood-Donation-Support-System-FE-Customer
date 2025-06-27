import { ChevronLeft, Calendar, Tag, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

import { useGetBlogBySlug } from "@/services/BlogService";
import { Badge } from "@/components/ui/badge";


const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, error } = useGetBlogBySlug(slug || "");

  if (isLoading) {
    return (
      <section className="py-32">
        <div className="container mx-auto flex max-w-5xl flex-col gap-10 px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading blog details...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="py-32">
        <div className="container mx-auto flex max-w-5xl flex-col gap-10 px-4">
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            <p>Failed to load blog post. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const publishedDate = new Date(blog.publishedAt);
  const formattedDate = format(publishedDate, "MMMM dd, yyyy");

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto flex max-w-5xl flex-col gap-10 px-4">
        <div className="relative flex flex-col justify-between gap-10 lg:flex-row">
          <aside className="top-10 h-fit flex-shrink-0 lg:sticky lg:w-[300px] xl:w-[400px]">
            <a
              className="text-muted-foreground hover:text-primary mb-5 flex items-center gap-1"
              href="/blog"
            >
              <ChevronLeft className="h-full w-4" />
              Quay trở về
            </a>
            <h1 className="mb-5 text-balance text-3xl font-bold lg:text-4xl">
              {blog.title}
            </h1>
            <div className="mb-6 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="px-2 py-1">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
               {formattedDate}
            </div>
          </aside>

          <article className="flex-1">
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="mb-8 mt-0 aspect-video w-full rounded-lg object-cover"
              />
            )}
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>
        </div>
      </div>
    </section>
  );
};

export { BlogDetail };
