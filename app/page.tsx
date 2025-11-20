import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function OnboardingPage() {
  return (
    <main className="flex h-screen flex-col bg-white">
      {/* Hero Section - 60% height */}
      <div className="relative h-[65%] w-full bg-custom-blue overflow-hidden">
        {/* Decorative circles/shapes can be added here if needed to match the image exactly */}
        <div className="absolute -top-5 right-0">
          <Image src="/assets/circle.svg" alt="circle" width={30} height={30} className="size-[88px]" />
        </div>

        {/* Zigzag pattern placeholder - using CSS or SVG */}
        <div className="absolute -rotate-[3.43deg] top-10 -left-7 ">
          <Image src="/assets/waves.svg" alt="waves" width={117.5} height={151} className="w-60 h-60" />
        </div>

        <div className="absolute -bottom-6 -right-20">
          <Image src="/assets/waves.svg" alt="waves" width={117.5} height={151} className="w-60 h-60" />
        </div>
      </div>

      {/* Content Section - Remaining height */}
      <div className="flex flex-1 flex-col justify-between max-h-[292px] px-8 pt-6 pb-9">
        <div className="space-y-4">
          <h1 className="text-2xl leading-[100%] font-semibold text-slate-900">
            Manage What To Do
          </h1>
          <p className="text-slate-500 font-normal leading-relaxed">
            The best way to manage what you have to do, don't forget your plans
          </p>
        </div>

        <div className="w-full">
          <Link href="/home" className="w-full block">
            <Button className="w-full bg-custom-blue hover:bg-custom-blue/80 text-white h-12 font-medium rounded-none leading-[20px] tracking-[0%] text-base">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </main >
  );
}
