'use client'

import { Todo } from "@prisma/client"
import { CheckCircle, Trash2, XCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

const TodoItem = (
  { todo, isAdmin = false, handleUpdate, handleDelete }
    :
    {
      todo: Todo
      isAdmin?: boolean
      handleUpdate: (id: string, completed: boolean) => void
      handleDelete: (id: string) => void
    }
) => {
  const [completed, setCompleted] = useState(todo.completed)
  const toggleComplete = async () => {
    handleUpdate(todo.id, !completed)
    setCompleted(c => !c)
  }
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <span className={completed ? 'line-through' : ''}>
          {todo.title}
        </span>
        <div className="flex items-center space-x-2">
          <Button variant='outline' size='sm' onClick={toggleComplete}>
            {completed ?
              <XCircle className="mr-2 h-4 w-4" />
              :
              <CheckCircle className="mr-2 h-4 w-4" />
            }
            {completed ? 'Undo' : 'Completed'}
          </Button>
          <Button variant='destructive' size='sm' onClick={() => handleDelete(todo.id)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
          {isAdmin&&(
            <span className="ml-2 text-sm text-muted-foreground">
              User ID: {todo.userID}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TodoItem