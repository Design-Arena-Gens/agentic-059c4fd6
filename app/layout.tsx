import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'रात के दो बजे | Horror Story',
  description: 'A chilling Hindi horror experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  )
}
