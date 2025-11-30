"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackArrow() {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mb-4 hover:bg-transparent hover:text-primary p-0 -ml-2"
            aria-label="Go back"
        >
            <ArrowLeft className="h-6 w-6" />
        </Button>
    );
}
