import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  return (
    <main className="flex h-screen flex-col bg-white">
      {/* Hero Section - 60% height */}
      <div className="relative h-[60%] w-full bg-blue-600 overflow-hidden">
        {/* Decorative circles/shapes can be added here if needed to match the image exactly */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-blue-500/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-blue-500/50 blur-3xl" />

        {/* Zigzag pattern placeholder - using CSS or SVG */}
        <div className="absolute top-20 left-10 opacity-20">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20 L10 10 L20 20 L30 10 L40 20 L50 10 L60 20" stroke="white" strokeWidth="4" fill="none" />
            <path d="M0 40 L10 30 L20 40 L30 30 L40 40 L50 30 L60 40" stroke="white" strokeWidth="4" fill="none" />
          </svg>
        </div>

        <div className="absolute bottom-20 right-10 opacity-20">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20 L10 10 L20 20 L30 10 L40 20 L50 10 L60 20" stroke="white" strokeWidth="4" fill="none" />
            <path d="M0 40 L10 30 L20 40 L30 30 L40 40 L50 30 L60 40" stroke="white" strokeWidth="4" fill="none" />
          </svg>
        </div>
      </div>

      {/* Content Section - Remaining height */}
      <div className="flex flex-1 flex-col justify-between px-8 py-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Manage What To Do
          </h1>
          <p className="text-slate-500 leading-relaxed">
            The best way to manage what you have to do, don't forget your plans
          </p>
        </div>

        <div className="w-full">
          <Link href="/home" className="w-full block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg rounded-xl shadow-lg shadow-blue-600/20">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
