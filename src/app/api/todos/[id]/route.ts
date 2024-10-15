import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    const { id } = params
    try {
        const { completed } = await req.json()
        const todo = await prisma.todo.findUnique({ where: { id } })
        if (!todo) return NextResponse.json({ error: 'TODO not found' }, { status: 404 })
        if (todo.userID !== userId) return NextResponse.json({ msg: 'Don\'t access others\' TODOs' }, { status: 403 })
        const updatedTodo = await prisma.todo.update({
            where: { id: todo.id },
            data: { completed }
        })
        return NextResponse.json(updatedTodo, { status: 200 })
    } catch (err) {
        console.log('Failed to Update Todo', err)
        return NextResponse.json({ error: 'Failed to Update Todo' }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    const { id } = params
    try {
        const todo = await prisma.todo.findUnique({ where: { id } })
        if (!todo) return NextResponse.json({ error: 'TODO not found' }, { status: 404 })
        if (todo.userID != userId) return NextResponse.json({ msg: 'Don\'t access others\' TODOs' }, { status: 403 })
        await prisma.todo.delete({ where: { id: todo.id } })
        return NextResponse.json({ msg: 'TODO deleted successfully' }, { status: 200 })
    } catch (err) {
        console.log('Failed to Delete Todo', err)
        return NextResponse.json({ error: 'Failed to Delete Todo' }, { status: 500 })
    }
}