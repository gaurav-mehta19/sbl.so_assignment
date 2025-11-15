'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FloatingInput, FloatingTextarea } from '@/components/ui/floating-input';
import { Loader } from '@/components/loader';
import { taskService } from '@/lib/api';
import Link from 'next/link';
import { Sparkles, Zap, Globe, Brain, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');

  const createTaskMutation = useMutation({
    mutationFn: () =>
      taskService.createTask({
        url: url.trim(),
        question: question.trim(),
      }),
    onSuccess: (data) => {
      router.push(`/task/${data.id}`);
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to create task';
      setError(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    createTaskMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Web Scraper AI
              </h1>
            </div>
            <Link href="/tasks">
              <Button variant="outline" size="sm">
                View All Tasks
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
            Ask AI About Any Website
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Enter a website URL and ask a question. Our AI will analyze the page and answer for you.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
            <CardDescription>
              Scrape a website and get AI-powered answers to your questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Website URL
                </label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={createTaskMutation.isPending}
                  className="dark:bg-slate-950"
                />
              </div>

              <div>
                <label htmlFor="question" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Your Question
                </label>
                <textarea
                  id="question"
                  placeholder="What is the main topic of this page?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={createTaskMutation.isPending}
                  rows={4}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={createTaskMutation.isPending}
                className="w-full gap-2"
              >
                {createTaskMutation.isPending ? (
                  <>
                    <Loader size="sm" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Submit Task
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/30">
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
                1
              </div>
              <p>
                Enter a website URL and your question about it
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
                2
              </div>
              <p>
                We scrape the website content and send it to our AI engine
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
                3
              </div>
              <p>
                Get your answer in real-time as we process your request
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

