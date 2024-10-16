import prisma from "@/lib/prisma"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

async function isAdmin(id: string) {
    const user = await clerkClient.users.getUser(id)
    return user.publicMetadata.role === 'admin'
}

const itemsPerPg = 10

export async function GET(req: NextRequest) {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    if (!(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const pg = Number(searchParams.get('pg')) || 1
    try {
        const user = await prisma.user.findUnique({
            where: { email: email || '' },
            include: {
                todos: {
                    orderBy: { createdAt: 'desc' },
                    take: itemsPerPg,
                    skip: (pg - 1) * itemsPerPg
                }
            }
        })
        if (!user) return NextResponse.json({ user: null, totalPgs: 0, currentPg: 1 })
        return NextResponse.json({
            user,
            totalPgs: Math.ceil(user.todos.length / itemsPerPg),
            currentPg: pg
        })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: 'Failed to get TODOs' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    if (!(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    try {
        const { email, id, completed, isSubscribed } = await req.json()
        if (id !== undefined && completed !== undefined) {
            const updatedTodo = await prisma.todo.update({
                where: { id },
                data: { completed }
            })
            return NextResponse.json(updatedTodo, { status: 200 })
        } else if (isSubscribed !== undefined) {
            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    isSubscribed,
                    subscriptionEnds: isSubscribed ? new Date(Date.now() + 3600000 * 720) : null
                }
            })
            return NextResponse.json(updatedUser, { status: 200 })
        }
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    if (!(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    try {
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'TODO ID is required' }, { status: 400 })
        await prisma.todo.delete({ where: { id } })
        return NextResponse.json({ msg: 'Deleted successfully' }, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ msg: 'Failed to delete' }, { status: 500 })
    }
}