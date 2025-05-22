"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Github } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ThemeToggle } from "@/shared/ui/feedback/theme-toggle";
import { MobileNavigation } from "@/shared/ui/navigation/mobile-navigation/MobileNavigation";
import { Button } from "@/shared/ui/inputs/button/Button";
import React, { useEffect, useState } from "react";

const navigation = [
    { name: "Главная", href: "/" },
    { name: "Анонимизация", href: "/anonymize" },
];

export interface HeaderProps {
    className?: string;
}

export function Header({ className }: HeaderProps) {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 8);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-500",
                scrolled ? "shadow-2xl bg-background/80 backdrop-blur-xl" : "bg-background/60 backdrop-blur-md",
                className
            )}
            role="banner"
            style={{
                WebkitBackdropFilter: "blur(16px)",
                backdropFilter: "blur(16px)",
                borderBottom: "1.5px solid rgba(var(--border),0.25)",
                animation: scrolled ? "fadeIn 0.7s cubic-bezier(0.19,1,0.22,1)" : undefined,
            }}
        >
            <div className="container flex h-16 sm:h-18 md:h-20 items-center justify-between gap-1 sm:gap-2 md:gap-4">
                {/* Логотип */}
                <div className="flex-1 flex items-center justify-start">
                  <Link
                      href="/"
                      className="flex items-center gap-1.5 sm:gap-2 md:gap-3 select-none px-0 sm:px-2 md:px-4 py-1.5 sm:py-2 focus-visible:ring-2 focus-visible:ring-primary outline-none group active:scale-95 transition-all duration-200 hover:text-primary"
                      aria-label="На главную"
                      tabIndex={0}
                  >
                      <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
                          <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-colors duration-200 group-hover:text-primary icon-animated" strokeWidth={2.2} />
                      </div>
                      <span className="font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl tracking-tight text-foreground leading-none transition-colors duration-200 group-hover:text-primary break-words">Datashield</span>
                  </Link>
                </div>

                {/* Навигация десктоп */}
                <nav className="hidden md:flex gap-2 items-center flex-1 justify-center" aria-label="Основная навигация">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-base font-semibold px-4 lg:px-5 py-2 rounded-2xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary outline-none",
                                isActive(item.href)
                                    ? "text-primary bg-primary/10 shadow-md"
                                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                            )}
                            aria-current={isActive(item.href) ? "page" : undefined}
                            tabIndex={0}
                            style={{ borderRadius: "var(--radius-2xl)" }}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Кнопки справа */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-3 flex-1 justify-end">
                    <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11">
                        <a
                            href="https://github.com/fred-yagofarov1314/anonymize-tool"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-2xl hover:bg-primary/10 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary shadow-lg hover:scale-[1.08] active:scale-95"
                            aria-label="GitHub"
                            tabIndex={0}
                            style={{ borderRadius: "var(--radius-2xl)" }}
                        >
                            <Github className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-primary icon-animated" strokeWidth={2.1} />
                        </a>
                    </div>
                    <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11">
                        <ThemeToggle className="scale-90 sm:scale-95 md:scale-100 transition-colors duration-200 hover:bg-primary/10 active:scale-95 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary shadow-lg" />
                    </div>
                    {/* Мобильное меню */}
                    <div className="md:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11">
                        <MobileNavigation
                            items={navigation.map((item) => ({
                                label: item.name,
                                href: item.href,
                            }))}
                            openIcon={<span className="flex items-center justify-center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></svg></span>}
                            closeIcon={<span className="flex items-center justify-center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>}
                            className=""
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}