'use client'

import BackBtn from "@/components/BackBtn"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Page = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriptionEnds, setSubscriptionEnds] = useState<string | null>(null)//
  const [loading, setLoading] = useState(false)
  const getSubscriptionStatus = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/subscription`)
      if (!res.ok) throw new Error('Failed to fetch Subscription Status')
      const response = await res.json()
      setIsSubscribed(response.isSubscribed)
      setSubscriptionEnds(response.subscriptionEnds)
    } catch (err) {
      console.log(err)
      toast({
        title: 'Error',
        description: 'Failed to Get Subscription Status',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])
  const subscribeHandler = async () => {
    try {
      const res = await fetch(`/api/subscription`, { method: 'POST' })
      const response = await res.json()
      if (res.ok) {
        setIsSubscribed(true)
        setSubscriptionEnds(response.subscriptionEnds)
        router.refresh()
        toast({
          title: 'Success',
          description: 'You have Subscribed Successfully!'
        })
      } else throw new Error(response.error || 'Failed to Subscribe')
    } catch (err) {
      console.log(err)
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An Error occurred while Subscribing. Please Try Again',
        variant: 'destructive'
      })
    }
  }
  useEffect(() => {
    getSubscriptionStatus()
  }, [getSubscriptionStatus])
  if (loading) return (
    <div className="flex justify-center items-center">
      Loading...
    </div>
  )
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <BackBtn />
      <h1 className="text-center text-3xl font-bold mb-8">
        Subscription
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>
            Your Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSubscribed ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You have already Subscribed. Subscription ends on {new Date(subscriptionEnds!).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert variant='destructive'>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You haven&apos;t subscribed yet. Subscribe now to access all Features.
                </AlertDescription>
              </Alert>
              <Button onClick={subscribeHandler} className='mt-4'>
                Subscribe Now
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Page