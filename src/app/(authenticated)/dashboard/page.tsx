'use client'

import Pagination from "@/components/Pagination"
import TodoForm from "@/components/TodoForm"
import TodoItem from "@/components/TodoItem"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/useToast"
import { useUser } from "@clerk/nextjs"
import { Todo } from "@prisma/client"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"

const Page = () => {
  const { user } = useUser()
  const { toast } = useToast()
  const [todos, setTodos] = useState<Todo[]>([])
  const [currentPg, setCurrentPg] = useState(0)
  const [pgs, setPgs] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [debounceSearch] = useDebounceValue(search, 700)
  const getTodos = useCallback(async (pg: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/todos?page=${pg}&search=${debounceSearch}`, { method: 'GET' })
      if (!res.ok) throw new Error('Failed to GET Todos')
      const response = await res.json()
      setTodos(response.todos)
      setPgs(response.totalPages)
      setCurrentPg(response.currentPg)
      toast({
        title: 'Success',
        description: 'TODOs fetched successfully'
      })
    } catch (err) {
      console.log(err)
      toast({
        title: 'Error',
        description: 'Failed to fetch TODOs',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [debounceSearch, toast])
  const getSubscriptionStatus = async () => {
    try {
      const res = await fetch(`/api/subscription`, { method: 'GET' })
      if (!res.ok) throw new Error('Failed to GET Subscription Status')
      const data = await res.json()
      setSubscribed(data.isSubscribed)
    } catch (err) {
      console.log(err)
    }
  }
  const newTodoHandler = async (title: string) => {
    toast({
      title: 'Creating TODO',
      description: 'Please wait.'
    })
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })
      if (!res.ok) throw new Error('Failed to create new TODO')
      await getTodos(currentPg)
      toast({
        title: 'Success',
        description: 'TODO Created Successfully'
      })
    } catch (err) {
      console.log(err)
      toast({
        title: 'Error',
        description: 'Failed to create TODO',
        variant: 'destructive'
      })
    }
  }
  const updateTodoHandler = async (id: string, completed: boolean) => {
    toast({
      title: 'Updating TODO',
      description: 'Please wait.'
    })
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      })
      if (!res.ok) throw new Error('Failed to update Todo')
      await getTodos(currentPg)
      toast({
        title: 'Success',
        description: 'TODO Updated Successfully'
      })
    } catch (err) {
      console.log(err)
      toast({
        title: 'Error',
        description: 'Failed to update TODO',
        variant: 'destructive'
      })
    }
  }
  const deleteTodoHandler = async (id: string) => {
    toast({
      title: 'Deleting TODO',
      description: 'Please wait.'
    })
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete Todo')
      await getTodos(currentPg)
      toast({
        title: 'Success',
        description: 'TODO Deleted Successfully'
      })
    } catch (err) {
      console.log(err)
      toast({
        title: 'Error',
        description: 'Failed to delete TODO',
        variant: 'destructive'
      })
    }
  }
  useEffect(() => {
    getTodos(1)
    getSubscriptionStatus()
  }, [getTodos])
  return (
    <div className='container p-4 mb-8 mx-auto max-w-3xl'>
      <h1 className="text-center text-3xl mb-8 font-bold">
        Welcome, {user?.emailAddresses[0].emailAddress}
      </h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            Create new TODO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TodoForm submit={newTodoHandler} />{/**/}
        </CardContent>
      </Card>
      {!subscribed && todos.length >= 3 && (
        <Alert variant='destructive' className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You&apos;ve reached the maximum no. of free TODOs
            <Link href='/subscribe' className="font-medium underline">
              Subscribe Now
            </Link>
            to CREATE more
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>
            My TODOs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input type="text" placeholder="Search TODOs" value={search} onChange={e => setSearch(e.target.value)} className="mb-4" />
          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading...
            </p>
          ) :
            todos.length === 0 ? (
              <p className="text-center text-muted-foreground">
                You have not created any TODO yet. Create one now!
              </p>
            ) : (
              <>
                <ul className="space-y-4">
                  {todos.map((t: Todo) => <TodoItem handleDelete={deleteTodoHandler} handleUpdate={updateTodoHandler} todo={t} key={t.id} />)}
                </ul>
                <Pagination currentPg={currentPg} pgChangeHandler={getTodos} totalPgs={pgs} />{/**/}
              </>
            )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Page