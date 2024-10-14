'use client'

import { FormEvent, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

const TodoForm = ({ submit }: { submit: (title: string) => void }) => {
  const [title, setTitle] = useState('')
  const submitHandler = (e: FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      submit(title.trim())
      setTitle('')
    }
  }
  return (
    <form onSubmit={submitHandler} className="flex space-x-2 mb-4">
      <Input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a new TODO" className="flex-grow" required />
      <Button type='submit' variant='outline'>
        Create TODO
      </Button>
    </form>
  )
}

export default TodoForm