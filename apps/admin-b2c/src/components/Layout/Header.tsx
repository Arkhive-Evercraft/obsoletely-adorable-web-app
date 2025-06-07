"use client";

import { TopNavigation } from "../Navigation/TopNavigation";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggleButton } from "@repo/ui/components";
import styles from './Layout.module.css';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <header className={`${styles.header} ${className || ''}`}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>StyleStore Admin</h1>
          <div className="flex items-center gap-4">
            <TopNavigation />
            <div className="flex items-center gap-3">
              <ThemeToggleButton size="sm" />
              {session?.user && (
                <>
                  <div className="flex items-center gap-2">
                    {session.user.image && (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || 'User'} 
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-700">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
    </header>
  );
}