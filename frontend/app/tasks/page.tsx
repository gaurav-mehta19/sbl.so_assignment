'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { FaviconDisplay } from '@/components/ui/favicon-display';
import { TaskCardSkeleton } from '@/components/ui/skeleton';
import { taskService, Task } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, FileText, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { useTasks } from '@/lib/store';

export default function TasksPage() {
  const { tasks, setTasks, filteredTasks, isLoading, setIsLoading, error, setError, stats } = useTasks();

  const { data, isLoading: queryLoading, isError, error: queryError, refetch, isFetching } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await taskService.getTasks();
      return response.tasks;
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    setIsLoading(queryLoading);
  }, [queryLoading, setIsLoading]);

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data, setTasks]);

  useEffect(() => {
    if (isError && queryError) {
      setError(queryError instanceof Error ? queryError.message : 'Failed to load tasks');
    } else {
      setError(null);
    }
  }, [isError, queryError, setError]);

  const sortedTasks = filteredTasks;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))]" style={{ '--tw-gradient-from': '#e6f1ff', '--tw-gradient-via': '#F5F7FA', '--tw-gradient-to': '#F5F7FA' } as React.CSSProperties} />
      
      {/* Navigation */}
      <nav className="relative border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="gap-2 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2 rounded-xl"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #1F6FEB 0%, #154d9d 100%)', boxShadow: '0 10px 15px -3px rgba(31, 111, 235, 0.3)' }}>
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold dark:text-white" style={{ color: '#1A1A1A' }}>
                  All Tasks
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''} created
                </p>
              </div>
            </div>
          </div>

          {/* Error State */}
          {isError && (
            <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 rounded-2xl">
              <CardContent className="pt-6">
                <p className="text-sm text-red-800 dark:text-red-300">
                  {error || 'Failed to load tasks'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <TaskCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && tasks.length === 0 && (
            <Card className="border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80 rounded-3xl">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, #e6f1ff 0%, #e6f1ff 100%)' }}>
                  <Sparkles className="h-10 w-10" style={{ color: '#1F6FEB' }} />
                </div>
                <h3 className="mb-2 text-2xl font-semibold dark:text-white" style={{ color: '#1A1A1A' }}>
                  No tasks yet
                </h3>
                <p className="mb-6 text-center text-slate-600 dark:text-slate-400">
                  Create your first task to get started with AI-powered web scraping
                </p>
                <Link href="/">
                  <Button className="gap-2 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #1F6FEB 0%, #154d9d 100%)', boxShadow: '0 10px 15px -3px rgba(31, 111, 235, 0.3)', color: '#FFFFFF' }}>
                    <Sparkles className="h-4 w-4" />
                    Create First Task
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Tasks Grid */}
          {!isLoading && tasks.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedTasks.map((task: Task) => (
                <Link key={task.id} href={`/task/${task.id}`} className="group">
                  <Card className="h-full border-slate-200/50 backdrop-blur-xl transition-all duration-200 hover:shadow-xl hover:-translate-y-1 dark:border-slate-800/50 dark:bg-slate-900/80 rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', '--hover-shadow': '0 20px 25px -5px rgba(31, 111, 235, 0.1)' } as React.CSSProperties}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3 mb-3">
                        <FaviconDisplay url={task.url} size="lg" className="mt-1" />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="line-clamp-2 text-base font-semibold dark:text-white leading-tight mb-2" style={{ color: '#1A1A1A' }}>
                            {task.question}
                          </CardTitle>
                          <StatusBadge status={task.status} size="sm" />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* URL */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Website
                        </p>
                        <div className="flex items-center gap-1.5 text-sm" style={{ color: '#1F6FEB' }}>
                          <span className="line-clamp-1 flex-1">
                            {new URL(task.url).hostname}
                          </span>
                          <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      {/* Answer Preview */}
                      {task.aiAnswer && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Answer Preview
                          </p>
                          <p className="line-clamp-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {task.aiAnswer}
                          </p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(task.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                          })}
                        </p>
                        <div className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#1F6FEB' }}>
                          View Details
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
