"use client";

import { authClient } from "@/server/better-auth/client";
import Dither from "@/components/global/Dither";

export default function Home() {
  return (
    <main className="bg-background relative flex min-h-screen w-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="h-full w-full opacity-5">
          <Dither
            waveColor={[0.5, 1, 0.7]}
            disableAnimation={false}
            mouseRadius={2}
            colorNum={4}
            waveAmplitude={0.3}
            waveFrequency={3}
            waveSpeed={0.05}
          />
        </div>
        <div className="bg-primary/20 absolute top-10 -left-24 z-50 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-chart-2/20 absolute -right-20 bottom-10 z-50 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-chart-4/20 absolute top-1/2 left-1/2 z-50 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <section className="bg-card/80 ring-border relative z-10 w-full max-w-md rounded-2xl border p-8 shadow-2xl ring-1 backdrop-blur-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              Personal Apps
            </h1>
          </div>
        </div>

        <button
          onClick={() =>
            authClient.signIn.social({
              provider: "google",
              callbackURL: "/dashboard",
            })
          }
          className="from-primary/10 to-primary/20 hover:from-primary/20 text-primary-foreground w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-emerald-300/10 bg-linear-to-b px-5 py-3 text-sm font-medium shadow-none transition duration-200"
        >
          Sign in with Google
        </button>
      </section>
    </main>
  );
}
