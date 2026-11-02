'use client'

import { createContext, useContext } from 'react'

const NotFoundContext = createContext<React.ReactNode>(null)

/**
 * Holds the 404 page, rendered by `[lang]/layout.tsx` in the page language.
 * `not-found.tsx` gets no route params, and reading `headers()` there would make
 * every page dynamic, because Next renders it as part of each page under the layout.
 */
export function NotFoundProvider({
  content,
  children,
}: {
  content: React.ReactNode
  children: React.ReactNode
}) {
  return <NotFoundContext value={content}>{children}</NotFoundContext>
}

export function NotFoundContent() {
  return useContext(NotFoundContext)
}
