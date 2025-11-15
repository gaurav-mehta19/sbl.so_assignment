'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FloatingInput, FloatingTextarea } from '@/components/ui/floating-input';
import { Loader } from '@/components/loader';
import { taskService } from '@/lib/api';
import Link from 'next/link';
import { Sparkles, Zap, Globe, Brain, ArrowRight, CheckCircle, ListTodo } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [question, setQuestion] = useState('');

  const createTaskMutation = useMutation({
    mutationFn: () =>
      taskService.createTask({
        url: url.trim(),
        question: question.trim(),
      }),
    onSuccess: (data) => {
      toast.success('Task created successfully!', {
        description: 'Redirecting to task details...',
      });
      setTimeout(() => router.push(`/task/${data.id}`), 500);
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      toast.error('Failed to create task', {
        description: errorMessage,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a website URL');
      return;
    }

    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    createTaskMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />
      
      {/* Navigation */}
      <nav className="relative border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/50">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Web Scraper AI
                </h1>
              </div>
            </div>
            <Link href="/tasks">
              <Button variant="outline" className="gap-2 rounded-xl">
                <ListTodo className="h-4 w-4" />
                All Tasks
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 sm:py-20">
            {/* Hero Header */}
            <div className="mx-auto max-w-4xl text-center mb-12 sm:mb-16">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 dark:border-indigo-800/50 dark:bg-indigo-950/30 dark:text-indigo-300">
                <Sparkles className="h-4 w-4" />
                AI-Powered Web Intelligence
              </div>
              
              <h2 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
                Ask AI Anything About{' '}
                <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Any Website
                </span>
              </h2>
              
              <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400 sm:text-xl">
                Enter a website URL and your question. Our AI will scrape the content and provide intelligent answers in seconds.
              </p>
            </div>

            {/* Main Form Card */}
            <div className="mx-auto max-w-3xl">
              <Card className="border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-900/5 dark:border-slate-800/50 dark:bg-slate-900/80 rounded-3xl overflow-hidden">
                <CardContent className="p-8 sm:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <FloatingInput
                      label="Website URL"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={createTaskMutation.isPending}
                      placeholder="https://example.com"
                      className="text-lg"
                      required
                    />

                    <FloatingTextarea
                      label="Your Question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      disabled={createTaskMutation.isPending}
                      placeholder="What would you like to know?"
                      rows={4}
                      className="text-lg"
                      required
                    />

                    <Button
                      type="submit"
                      disabled={createTaskMutation.isPending}
                      className="w-full h-14 text-base font-semibold rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/50 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-[1.02]"
                    >
                      {createTaskMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <Loader size="sm" />
                          Creating Task...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Ask AI
                          <ArrowRight className="h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div className="mx-auto max-w-6xl mt-16 sm:mt-24">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="group rounded-2xl border border-slate-200/50 bg-white/50 p-6 backdrop-blur-sm transition-all hover:border-indigo-200 hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-indigo-800">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-indigo-950/30 dark:text-indigo-400">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    Smart Web Scraping
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Advanced scraping technology extracts relevant content from any website automatically.
                  </p>
                </div>

                <div className="group rounded-2xl border border-slate-200/50 bg-white/50 p-6 backdrop-blur-sm transition-all hover:border-purple-200 hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-purple-800">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-transform group-hover:scale-110 dark:bg-purple-950/30 dark:text-purple-400">
                    <Brain className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    AI-Powered Analysis
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Gemini AI processes content and provides accurate, contextual answers to your questions.
                  </p>
                </div>

                <div className="group rounded-2xl border border-slate-200/50 bg-white/50 p-6 backdrop-blur-sm transition-all hover:border-emerald-200 hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-emerald-800 sm:col-span-2 lg:col-span-1">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    Instant Results
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Get answers in seconds with real-time processing and background task management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
