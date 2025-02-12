import React from "react"
import { useState, useEffect } from "react"
import { Calendar, Clock, User, ArrowRight, Search, X } from "lucide-react"

function Blog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All Posts")
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const blogPosts = [
    {
      id: 1,
      title: "Master the Technical Interview",
      excerpt: "Learn the top strategies and patterns to ace your next technical interview.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      category: "Interview Tips",
      author: "Sarah Chen",
      date: "March 15, 2024",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1",
      tags: ["Technical", "Coding"],
    },
    {
      id: 2,
      title: "Behavioral Interview Questions Decoded",
      excerpt: "Understanding the STAR method and how to structure your responses effectively.",
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      category: "Career Advice",
      author: "Michael Ross",
      date: "March 12, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
      tags: ["Behavioral"],
    },
    {
      id: 3,
      title: "Negotiating Your Job Offer",
      excerpt: "Expert tips on how to negotiate your salary and benefits package successfully.",
      content:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      category: "Negotiation",
      author: "Emily Watson",
      date: "March 10, 2024",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
      tags: ["Career Growth"],
    },
    {
      id: 4,
      title: "The Future of Remote Work",
      excerpt: "Exploring trends and predictions for the evolving landscape of remote work.",
      content:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      category: "Career Advice",
      author: "Alex Johnson",
      date: "March 8, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      tags: ["Remote Work", "Future Trends"],
    },
    {
      id: 5,
      title: "Building Your Personal Brand",
      excerpt: "Strategies to establish and grow your professional presence online.",
      content:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
      category: "Career Growth",
      author: "Olivia Martinez",
      date: "March 5, 2024",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
      tags: ["Personal Branding", "Social Media"],
    },
    {
      id: 6,
      title: "Mastering Data Structures",
      excerpt: "A comprehensive guide to understanding and implementing key data structures.",
      content:
        "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
      category: "Technical Skills",
      author: "David Lee",
      date: "March 2, 2024",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
      tags: ["Data Structures", "Algorithms"],
    },
  ]

  const categories = [
    "All Posts",
    "Interview Tips",
    "Career Advice",
    "Technical Skills",
    "Negotiation",
    "Career Growth",
  ]

  const openModal = (post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = "auto"
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section - Simplified and Modern */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-left">
          <h1 className="text-5xl font-bold text-slate-800 leading-tight mb-6 animate-fade-up">
            Latest from our blog
          </h1>
          <div className="flex items-center gap-8">
            <p className="text-lg text-slate-600 max-w-xl animate-fade-up delay-100">
              Discover insights and strategies to propel your career forward
            </p>
            <div className="relative w-96 animate-fade-up delay-200">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white shadow-sm border border-slate-200 focus:ring-2 focus:ring-[#F3C178]/20 focus:border-[#F3C178] transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post - Horizontal Hero Post */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <article className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="grid grid-cols-2 gap-8">
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <span className="bg-[#F3C178]/10 text-[#F3C178] px-3 py-1 rounded-full">Featured</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {blogPosts[0].date}
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-4 group-hover:text-[#F3C178] transition-colors duration-300">
                  {blogPosts[0].title}
                </h2>
                <p className="text-slate-600 mb-8 text-lg">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F3C178]/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#F3C178]" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{blogPosts[0].author}</p>
                      <p className="text-sm text-slate-500">{blogPosts[0].readTime}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(blogPosts[0])}
                    className="group/btn flex items-center gap-2 text-[#F3C178] font-medium hover:gap-3 transition-all duration-300"
                  >
                    Read Article
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Categories - Horizontal Scroll */}
      <section className="px-4 mb-16 overflow-x-auto hide-scrollbar">
        <div className="max-w-7xl mx-auto flex gap-4 pb-4">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#F3C178] text-white shadow-lg shadow-[#F3C178]/20"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts - Horizontal Cards */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="grid grid-cols-[2fr,3fr] gap-8">
                  <div className="relative overflow-hidden aspect-[3/2]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="py-8 pr-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-[#F3C178] transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 mb-6">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F3C178]/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-[#F3C178]" />
                        </div>
                        <span className="font-medium text-slate-900">{post.author}</span>
                      </div>
                      <button
                        onClick={() => openModal(post)}
                        className="group/btn flex items-center gap-1 text-[#F3C178] font-medium hover:gap-2 transition-all duration-300"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b">
              <h2 className="text-2xl font-bold text-[#F3C178]">{selectedPost.title}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedPost.image || "/placeholder.svg"}
                alt={selectedPost.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {selectedPost.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {selectedPost.readTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {selectedPost.author}
                </span>
              </div>
              <p className="text-gray-700 mb-6">{selectedPost.content}</p>
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map((tag, index) => (
                  <span key={index} className="bg-[#F3C178]/10 text-[#F3C178] px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog



