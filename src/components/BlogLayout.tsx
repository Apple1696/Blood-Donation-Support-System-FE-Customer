import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const BlogLayout = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Web Development",
      description: "Exploring the latest trends in frontend and backend technologies, including AI-powered coding tools and modern frameworks.",
      date: "3RD DEC 2024",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&crop=center",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Mastering React Performance Optimization",
      description: "A deep dive into memoization, lazy loading, and efficient state management techniques for faster React applications.",
      date: "1ST DEC 2024",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop&crop=center",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "Building Scalable APIs with Node.js",
      description: "Best practices for creating robust, maintainable APIs that can handle high traffic and complex business logic.",
      date: "28TH NOV 2024",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop&crop=center",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            Discover Our<br />
            Fresh Content
          </h1>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Post - Large */}
          <Card className="lg:row-span-2 bg-white shadow-sm border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-gray-500 tracking-wide">
                  {blogPosts[0].date}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{blogPosts[0].readTime}</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {blogPosts[0].title}
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {blogPosts[0].description}
              </p>
              
              <button className="inline-flex items-center gap-2 text-red-500 font-medium hover:text-red-600 transition-colors group">
                Read
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </CardContent>
          </Card>

          {/* Regular Posts */}
          {blogPosts.slice(1).map((post) => (
            <Card key={post.id} className="bg-white shadow-sm border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-[16/9] overflow-hidden">
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-gray-500 tracking-wide">
                    {post.date}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {post.description}
                </p>
                
                <button className="inline-flex items-center gap-2 text-red-500 font-medium hover:text-red-600 transition-colors group">
                  Read
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-12">
          <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
            Load More Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogLayout;