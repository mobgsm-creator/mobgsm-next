// components/LoginButton.tsx
'use client'


import { Button } from '@/components/ui/button'

export default function LoginButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => (window.location.href = "/register")}
    >
      Login
    </Button>
  )
}
