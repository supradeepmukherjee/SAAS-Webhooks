'use client'

import Pagination from "@/components/Pagination"
import TodoItem from "@/components/TodoItem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/useToast"
import { Todo, User } from "@prisma/client"
import { FormEvent, useCallback, useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"

interface UserAndTodos extends User { todos: Todo[] }

const Page = () => {
  const { toast } = useToast()
  const [user, setUser] = useState<UserAndTodos | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentPg, setCurrentPg] = useState(0)
  const [pgs, setPgs] = useState(0)
  const [email, setEmail] = useState('')
  const [debouncedEmail, setDebouncedEmail] = useDebounceValue(email, 700)
  const getUser = useCallback(async (pg: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin?pg=${pg}&email=${debouncedEmail}`)
      if (!res.ok) throw new Error('Failed to fetch user data')
      const data = await res.json()
      setUser(data.user)
      setCurrentPg(data.currentPg)
      setPgs(data.totalPgs)
      toast({
        title: 'Success',
        description: 'User Details Fetched Successfully'
      })
    } catch (err) {
      console.log(err)
      toast({
        title: 'Error',
        description: 'Failed to fetch User Details',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [debouncedEmail, toast])
  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    setDebouncedEmail(email)
  }
  const updateSubscription = async () => {
    toast({
      title: 'Updating Subscription',
      description: 'Please wait.'
    })
    try {
      const res = await fetch(`/api/admin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: debouncedEmail,
          isSubscribed: !user?.isSubscribed
        })
      })
      if (!res.ok) throw new Error('Failed to Update Subscription')
      getUser(currentPg)
      toast({
        title: 'Success',
        description: 'User Subscription Updated Successfully'
      })
    } catch (err) {
      console.log(err)
      toast({
        title: 'Error',
        description: 'Failed to update User Subscription',
        variant: 'destructive'
      })
    }
  }
  const updateTodo = async (id: string, completed: boolean) => {
    toast({
      title: 'Updating Todo',
      description: 'Please wait.'
    })
    try {
      const res = await fetch(`/api/admin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: debouncedEmail,
          id,
          completed
        })
      })
      if (!res.ok) throw new Error('Failed to Update Todo')
      getUser(currentPg)
      toast({
        title: 'Success',
        description: 'User Todo Updated Successfully'
      })
    } catch (err) {
      console.log(err)
      toast({
        title: 'Error',
        description: 'Failed to update User Todo',
        variant: 'destructive'
      })
    }
  }
  const deleteTodo = async (id: string) => {
    toast({
      title: 'Deleting Todo',
      description: 'Please wait.'
    })
    try {
      const res = await fetch(`/api/admin`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) throw new Error('Failed to Delete Todo')
      getUser(currentPg)
      toast({
        title: 'Success',
        description: 'User Todo Deleted Successfully'
      })
    } catch (err) {
      console.log(err)
      toast({
        title: 'Error',
        description: 'Failed to Delete User Todo',
        variant: 'destructive'
      })
    }
  }
  useEffect(() => {
    if (debouncedEmail) getUser(1)
  }, [debouncedEmail, getUser])
  return (
    <div className="container mx-auto p-4 mb-8 max-w-3xl">
      <h1 className="text-center font-bold mb-8 text-3xl">
        Admin Dashboard
      </h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            Search User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={searchHandler} className="flex space-x-2">
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter User Email" required />
            <Button type="submit">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>
      {loading ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Loading User Data
            </p>
          </CardContent>
        </Card>
      )
        :
        user ? (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  User Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Email: {user.email}
                </p>
                <p>
                  Subscription Status: {user.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                </p>
                {user.subscriptionEnds && (
                  <p>
                    Subscription Ends: {new Date(user.subscriptionEnds).toLocaleDateString()}
                  </p>
                )}
                <Button onClick={updateSubscription} className="mt-2">
                  {user.isSubscribed ? 'Cancel Subscription' : 'Subscribe User'}
                </Button>
              </CardContent>
            </Card>
            {user.todos.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    User Todos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {user.todos.map(t => <TodoItem handleDelete={deleteTodo} handleUpdate={updateTodo} todo={t} key={t.id} isAdmin={true} />)}
                  </ul>
                  <Pagination currentPg={currentPg} pgChangeHandler={getUser} totalPgs={pgs} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    The User hasn&apos;t created any Todo yet
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )
          :
          debouncedEmail ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  No User found with this Email ID
                </p>
              </CardContent>
            </Card>
          ) : null
      }
    </div>
  )
}

export default Page