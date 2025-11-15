'use client';

import { useEffect } from 'react';
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
import { useTaskForm, useTaskCreation } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const { formData, updateUrl, updateQuestion, clearForm } = useTaskForm();
  const { isCreating, setIsCreating } = useTaskCreation();

  // Clear form when component mounts (on page load/reload)
  useEffect(() => {
    clearForm();
  }, [clearForm]);

  const createTaskMutation = useMutation({
    mutationFn: () =>
      taskService.createTask({
        url: formData.url.trim(),
        question: formData.question.trim(),
      }),
    onSuccess: (data) => {
      setIsCreating(false);
      toast.success('Task created successfully!', {
        description: 'Redirecting to task details...',
      });
      clearForm();
      setTimeout(() => router.push(`/task/${data.id}`), 500);
    },
    onError: (err: unknown) => {
      setIsCreating(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      toast.error('Failed to create task', {
        description: errorMessage,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.url.trim()) {
      toast.error('Please enter a website URL');
      return;
    }

    if (!formData.question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    try {
      new URL(formData.url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsCreating(true);
    createTaskMutation.mutate();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))]" style={{ '--tw-gradient-from': '#e6f1ff', '--tw-gradient-via': '#F5F7FA', '--tw-gradient-to': '#F5F7FA' } as React.CSSProperties} />
      
      {/* Navigation */}
      <nav className="relative border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #1F6FEB 0%, #154d9d 100%)', boxShadow: '0 10px 15px -3px rgba(31, 111, 235, 0.3)' }}>
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold dark:text-white" style={{ color: '#1A1A1A' }}>
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
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium" style={{ borderColor: '#1F6FEB40', backgroundColor: '#e6f1ff', color: '#1a5ec4' }}>
                <Sparkles className="h-4 w-4" />
                AI-Powered Web Intelligence
              </div>
              
              <h2 className="mb-6 text-5xl font-bold leading-tight tracking-tight dark:text-white sm:text-6xl lg:text-7xl" style={{ color: '#1A1A1A' }}>
                Ask AI Anything About{' '}
                <span className="bg-clip-text text-transparent" style={{ background: 'linear-gradient(135deg, #1F6FEB 0%, #154d9d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                  <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                    <FloatingInput
                      label="Website URL"
                      type="url"
                      value={formData.url}
                      onChange={(e) => updateUrl(e.target.value)}
                      disabled={isCreating}
                      placeholder="https://example.com"
                      className="text-lg"
                      autoComplete="off"
                      required
                    />

                    <FloatingTextarea
                      label="Your Question"
                      value={formData.question}
                      onChange={(e) => updateQuestion(e.target.value)}
                      disabled={isCreating}
                      placeholder="What would you like to know?"
                      rows={4}
                      className="text-lg"
                      autoComplete="off"
                      required
                    />

                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="w-full h-14 text-base font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(135deg, #1F6FEB 0%, #154d9d 100%)', boxShadow: '0 10px 15px -3px rgba(31, 111, 235, 0.3)', color: '#FFFFFF' }}
                    >
                      {isCreating ? (
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
                <div className="group rounded-2xl border border-slate-200/50 p-6 backdrop-blur-sm transition-all hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-900/50" style={{ backgroundColor: '#FFFFFF' }}>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110" style={{ backgroundColor: '#e6f1ff', color: '#1F6FEB' }}>
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold dark:text-white" style={{ color: '#1A1A1A' }}>
                    Smart Web Scraping
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Advanced scraping technology extracts relevant content from any website automatically.
                  </p>
                </div>

                <div className="group rounded-2xl border border-slate-200/50 p-6 backdrop-blur-sm transition-all hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-900/50" style={{ backgroundColor: '#FFFFFF' }}>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110" style={{ backgroundColor: '#fff9e6', color: '#8a6d00' }}>
                    <Brain className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold dark:text-white" style={{ color: '#1A1A1A' }}>
                    AI-Powered Analysis
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Gemini AI processes content and provides accurate, contextual answers to your questions.
                  </p>
                </div>

                <div className="group rounded-2xl border border-slate-200/50 p-6 backdrop-blur-sm transition-all hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-900/50 sm:col-span-2 lg:col-span-1" style={{ backgroundColor: '#FFFFFF' }}>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110" style={{ backgroundColor: '#e8f5e9', color: '#4CAF50' }}>
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold dark:text-white" style={{ color: '#1A1A1A' }}>
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
