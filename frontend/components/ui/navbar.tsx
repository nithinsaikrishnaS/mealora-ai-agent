"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, User, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()
    const [activeSection, setActiveSection] = useState("home")

    const links = [
        { id: "home", label: "Home" },
        { id: "about", label: "About Me" },
        { id: "faq", label: "FAQs" },
        { id: "contact", label: "Contact" },
    ]

    const scrollToSection = (id: string) => {
        if (pathname !== "/") {
            router.push(`/#${id}`)
            return
        }

        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
            setActiveSection(id)
        }
    }

    // Update active section on scroll
    useEffect(() => {
        if (pathname !== "/") return

        const handleScroll = () => {
            const sections = links.map(link => document.getElementById(link.id))
            const scrollPosition = window.scrollY + 100 // Offset

            for (const section of sections) {
                if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                    setActiveSection(section.id)
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [pathname])

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-primary/10">
            <div className="container flex h-20 items-center justify-between">
                {/* Logo - Left Aligned */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href="/" className="flex items-center gap-2 group" onClick={() => scrollToSection("home")}>
                        <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                            <span className="text-2xl">🥗</span>
                        </div>
                        <span className="text-2xl font-bold text-foreground tracking-tight font-heading">MEALORA</span>
                    </Link>
                </div>

                {/* Navigation Links - Centered */}
                <div className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
                    {links.map((link) => {
                        const isActive = activeSection === link.id && pathname === "/"
                        return (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-full",
                                    isActive ? "text-primary" : "text-foreground/80"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-active"
                                        className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {link.label}
                            </button>
                        )
                    })}
                </div>

                {/* Auth & Mobile Menu - Right Aligned */}
                <div className="flex items-center gap-4 flex-shrink-0">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/20 p-0 overflow-hidden hover:scale-105 transition-transform">
                                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold">
                                        {getInitials(user.full_name)}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.full_name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href="/saved-plans">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <span className="mr-2">📚</span>
                                        <span>Saved Plans</span>
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/auth/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button>Sign Up</Button>
                            </Link>
                        </div>
                    )}
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </nav>
    )
}
