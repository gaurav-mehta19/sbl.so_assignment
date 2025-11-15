'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader';
import { taskService, Task } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, FileText } from 'lucide-react';

// Status badge component
function StatusBadge({ status, className = '' }: { status: string; className?: string }) {
  const statusConfig = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
      } ${className}`}
    >
      {status}
    </span>
  );
}

// Full page loader component
function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        <p className="text-sm text-slate-600 dark:text-slate-400">Loading tasks...</p>
      </div>
    </div>
  );
}

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
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
            All Tasks
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} created
          </p>
        </div>

        {isError && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
            <CardContent className="pt-6">
              <p className="text-sm text-red-800 dark:text-red-300">
                {error instanceof Error
                  ? error.message
                  : 'Failed to load tasks'}
              </p>
            </CardContent>
          </Card>
        )}

        {tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-12 w-12 text-slate-400" />
              <p className="mb-4 text-slate-600 dark:text-slate-400">
                No tasks created yet
              </p>
              <Link href="/">
                <Button>Create Your First Task</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTasks.map((task: Task) => (
              <Link key={task.id} href={`/task/${task.id}`}>
                <Card className="h-full transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2 text-base">
                        {task.question}
                      </CardTitle>
                      <StatusBadge status={task.status} className="shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        URL
                      </p>
                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="line-clamp-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {task.url}
                      </a>
                    </div>

                    {task.aiAnswer && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Answer Preview
                        </p>
                        <p className="line-clamp-2 text-sm text-slate-700 dark:text-slate-300">
                          {task.aiAnswer}
                        </p>
                      </div>
                    )}

                    <div className="space-y-1 border-t border-slate-200 pt-3 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(task.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
