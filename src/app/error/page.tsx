'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Page = () => {
  const router = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000);
    return () => clearTimeout(timer)
  }, [router])
  return (
    <div className="container flex items-center justify-center mx-auto min-h-screen p-4 max-w-3xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-center text-2xl font-bold">
            <AlertTriangle className="h-6 w-6 mr-2 text-destructive" /> OOPS! Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            We encountered an unexpected Error. But, Don&apos;t worry, we are working to fix it asap.
          </p>
          <p className="text-muted-foreground mb-6">
            You&apos;ll be redirected to the home page in 5 seconds, or you can click the Button below.
          </p>
          <Button onClick={() => router.push('/')} className="w-full sm:w-auto">
            Go to Home Page
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page