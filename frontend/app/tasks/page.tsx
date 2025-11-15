'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { FaviconDisplay } from '@/components/ui/favicon-display';
import { TaskCardSkeleton } from '@/components/ui/skeleton';
import { taskService, Task } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, FileText, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

export default function TasksPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await taskService.getTasks();
      return response.tasks;
    },
    refetchInterval: 5000,
  });

  const tasks = data || [];

  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />
      
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/50">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
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
                  {error instanceof Error ? error.message : 'Failed to load tasks'}
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
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30">
                  <Sparkles className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  No tasks yet
                </h3>
                <p className="mb-6 text-center text-slate-600 dark:text-slate-400">
                  Create your first task to get started with AI-powered web scraping
                </p>
                <Link href="/">
                  <Button className="gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/50">
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
                  <Card className="h-full border-slate-200/50 bg-white/80 backdrop-blur-xl transition-all duration-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 dark:border-slate-800/50 dark:bg-slate-900/80 dark:hover:border-indigo-800 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3 mb-3">
                        <FaviconDisplay url={task.url} size="lg" className="mt-1" />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-white leading-tight mb-2">
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
                        <div className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400">
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
                        <div className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
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
