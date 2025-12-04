"use client";

import { useRef } from "react";
import { ArrowLeft, Brain, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemoriesAndLearningsQuery } from "@/hooks/memoriesAndLearnings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function MemoriesPage() {
  const { data: memoriesAndLearnings, isLoading } = useMemoriesAndLearningsQuery();
  const searchQuery = useRef<HTMLInputElement>(null); // TODO: Add search functionality
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="-ml-2 gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900">Memories & Learnings</h1>
                  <p className="mt-1 text-slate-600">Your journey of growth and reflection</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
              <p className="text-3xl font-bold text-slate-900">
                {memoriesAndLearnings?.data?.memories.length ?? 0}
              </p>
              <p className="text-sm text-slate-500">Total memories</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
            <Input
              ref={searchQuery}
              placeholder="Search memories and learnings..."
              className="h-12 border-slate-200 bg-slate-50 pl-12 text-base focus-visible:ring-slate-900"
            />
          </div>
        </div>

        {/* Memories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
              <p className="font-medium text-slate-600">Loading your memories...</p>
            </div>
          </div>
        ) : memoriesAndLearnings?.data?.memories.length === 0 ? (
          <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
              <Brain className="h-10 w-10 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">No memories found</h3>
              <p className="mx-auto max-w-md text-slate-600">
                {searchQuery
                  ? "Try adjusting your filters or search query to find what you're looking for."
                  : "Start your journey by completing daily check-ins and recording your learnings."}
              </p>
            </div>
            <Link href="/">
              <Button className="mt-6 h-11 gap-2 bg-slate-900 px-6 hover:bg-slate-800">
                <Sparkles className="h-4 w-4" />
                Start a Check-In
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {memoriesAndLearnings?.data?.memories.map(memory => (
              <Card key={memory.id}>
                <CardHeader>
                  <CardTitle>{`${memory.createdAt.getFullYear()}-${memory.createdAt.getMonth() + 1}-${memory.createdAt.getDate()}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{memory.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
