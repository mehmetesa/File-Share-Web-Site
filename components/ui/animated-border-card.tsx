"use client"

import { cn } from "@/lib/utils"
import React from "react"

export function AnimatedBorderCard({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("relative overflow-hidden rounded-xl p-[1px]", className)}>
            {/* Spinning Gradient Border */}
            <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#ffffff_360deg)]"
                style={{ animationDuration: "4s" }}
            />

            {/* Inner Content Background - covers the center so only border is visible */}
            <div className="relative h-full w-full rounded-xl bg-[#09090b]">
                {children}
            </div>
        </div>
    )
}
