import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

const itemsPerPg = 10

export async function GET(req: NextRequest) {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    const { searchParams } = new URL(req.url)
    const pg = Number(searchParams.get('page')) || 1
    const search = searchParams.get('search') || ''
    try {
        const todos = await prisma.todo.findMany({
            where: {
                userID: userId,
                title: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            orderBy: { createdAt: 'desc' },
            take: itemsPerPg,
            skip: (pg - 1) * itemsPerPg
        })
        return NextResponse.json({
            todos,
            currentPg: pg,
            totalPages: Math.ceil(todos.length / itemsPerPg)
        })
    } catch (err) {
        console.log('Failed to GET Todos', err)
        return NextResponse.json({ error: 'Failed to GET Todos' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
        try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { todos: true }
        })
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
        if (!user.isSubscribed && user.todos.length >= 3) return NextResponse.json({ error: 'Free Users can only create upto 3 todos. Please subscribe to create unlimited todos.' }, { status: 402 })
        const { title } = await req.json()
        const todo = await prisma.todo.create({
            data: {
                title,
                userID: userId
            }
        })
        return NextResponse.json(todo, { status: 201 })
    } catch (err) {
        console.log('Failed to Create Todo', err)
        return NextResponse.json({ error: 'Failed to create new Todo' }, { status: 500 })
    }
}