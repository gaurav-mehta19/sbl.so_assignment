'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader';
import { taskService } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

// Simple markdown parser for AI answers
function parseMarkdown(text: string) {
  if (!text) return null;

  // Split by double newlines to get paragraphs
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((paragraph, pIndex) => {
    // Parse inline markdown within each paragraph
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Match **bold** text
    const boldRegex = /\*\*(.+?)\*\*/g;
    let match;

    while ((match = boldRegex.exec(paragraph)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(paragraph.substring(lastIndex, match.index));
      }
      // Add bold text
      parts.push(
        <strong key={`bold-${pIndex}-${match.index}`} className="font-semibold">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < paragraph.length) {
      parts.push(paragraph.substring(lastIndex));
    }

    // Wrap in paragraph
    return (
      <p key={`p-${pIndex}`} className="mb-4 last:mb-0 leading-relaxed">
        {parts.length > 0 ? parts : paragraph}
      </p>
    );
  });
}

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
        <p className="text-sm text-slate-600 dark:text-slate-400">Loading task...</p>
      </div>
    </div>
  );
}

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = Number(params.id);
  const [copied, setCopied] = useState(false);

  const { data: task, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getTask(taskId),
    refetchInterval: (query) => {
      const taskData = query.state.data;
      if (taskData?.status === 'completed' || taskData?.status === 'failed') {
        return false;
      }
      return 2000;
    },
    retry: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (task?.status === 'pending' || task?.status === 'processing') {
        refetch();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [task?.status, refetch]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (isError || !task) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </nav>

        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
            <CardHeader>
              <CardTitle className="text-red-900 dark:text-red-200">
                Error Loading Task
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-red-800 dark:text-red-300">
              <p className="mb-4">
                {error instanceof Error
                  ? error.message
                  : 'Failed to load task details'}
              </p>
              <Link href="/">
                <Button variant="outline">Create New Task</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const isCompleted = task.status === 'completed';
  const isFailed = task.status === 'failed';
  const isProcessing = task.status === 'processing' || task.status === 'pending';

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href="/tasks">
              <Button variant="outline" size="sm">
                View All Tasks
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Task Details
            </h2>
            <StatusBadge status={task.status} />
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            {isProcessing
              ? 'Your task is being processed...'
              : isCompleted
                ? 'Task completed successfully'
                : 'Task failed'}
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Task ID
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded bg-slate-100 p-2 font-mono text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                    {task.id}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(String(task.id))}
                    className="shrink-0"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Website URL
                </label>
                <a
                  href={task.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-blue-600 hover:underline dark:text-blue-400"
                >
                  {task.url}
                </a>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Question
                </label>
                <p className="text-slate-700 dark:text-slate-300">{task.question}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <StatusBadge status={task.status} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Created
                  </label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isFailed && task.errorMessage && (
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
              <CardHeader>
                <CardTitle className="text-red-900 dark:text-red-200">
                  Error
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-red-800 dark:text-red-300">
                {task.errorMessage}
              </CardContent>
            </Card>
          )}

          {(isCompleted || task.aiAnswer) && (
            <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
              <CardHeader>
                <CardTitle className="text-green-900 dark:text-green-200 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  AI Answer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 dark:text-slate-300">
                <div className="rounded bg-white p-4 dark:bg-slate-900">
                  {task.aiAnswer ? parseMarkdown(task.aiAnswer) : 'Processing...'}
                </div>
              </CardContent>
            </Card>
          )}

          {isProcessing && (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
              <CardHeader>
                <CardTitle className="text-amber-900 dark:text-amber-200">
                  Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-amber-800 dark:text-amber-300">
                <p>Your task is being processed. Please wait...</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-amber-600" />
                    <span>
                      {task.status === 'pending'
                        ? 'Waiting in queue'
                        : 'Scraping website and processing'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Link href="/" className="flex-1">
              <Button className="w-full">Create New Task</Button>
            </Link>
            <Link href="/tasks" className="flex-1">
              <Button variant="outline" className="w-full">
                View All Tasks
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
