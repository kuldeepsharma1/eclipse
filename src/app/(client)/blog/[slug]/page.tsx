'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Calendar, Clock,  Eye, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { getBlogPost, likeBlogPost, addComment } from '@/actions/blogActions';

import type { BlogPost } from '@/types/blog';

export default function BlogPostPage() {
  const params = useParams();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getBlogPost(params.slug as string);
        if (response.error) {
          throw new Error(response.error);
        }
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to fetch blog post');
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  const handleLike = async () => {
    if (!post ) {
      toast.error('Please sign in to like posts');
      return;
    }
    
    try {
      const response = await likeBlogPost(post.slug);
      if (response.error) {
        throw new Error(response.error);
      }
      setPost(response.data);
      toast.success('Post liked!');
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to like post');
    }
  };

  const handleComment = async () => {
    if (!post || !comment.trim() || !session) {
      toast.error('Please sign in to comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await addComment(post.slug, session.user.id, comment.trim());
      if (response.error) {
        throw new Error(response.error);
      }
      setPost(response.data);
      setComment('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 animate-pulse">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-muted rounded w-3/4 mb-4" />
          <div className="h-6 bg-muted rounded w-1/2 mb-8" />
          <div className="h-96 bg-muted rounded mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p className="text-muted-foreground">The blog post you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post?.categories.map((category) => (
                <Badge key={category} variant="secondary" className="capitalize">
                  {category}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post?.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post?.author.image} />
                  <AvatarFallback>
                    {post ? `${post.author.firstName[0]}${post.author.lastName[0]}` : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {post?.author.firstName} {post?.author.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post?.readTime} min read</span>
              </div>
            </div>
          </div>

          {post?.featuredImage && (
            <div className="relative w-full aspect-video mb-12 rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div 
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post?.content || '' }}
          />

          <div className="flex items-center justify-between py-6 border-t border-b">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleLike}
                disabled={!session}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post?.likes}</span>
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{post?.views} views</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>{post?.comments.length} comments</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }}
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            {session ? (
              <div className="mb-8">
                <Textarea
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px] mb-4"
                />
                <Button 
                  onClick={handleComment}
                  disabled={isSubmitting || !comment.trim()}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-4 mb-8 text-center">
                <p className="text-muted-foreground">Please sign in to comment</p>
              </div>
            )}
            <div className="space-y-6">
              {post?.comments.map((comment, index) => (
                <div key={index} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user.image} />
                    <AvatarFallback>
                      {`${comment.user.firstName[0]}${comment.user.lastName[0]}`}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {comment.user.firstName} {comment.user.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
