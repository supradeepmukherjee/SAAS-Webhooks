import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

async function isAdmin(id: string) {
    const user = await clerkClient.users.getUser(id)
    return user.publicMetadata.role === 'admin'
}

const itemsPerPg = 10

export async function GET(req: NextRequest) {
    const { userId } = auth()
    if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const pg = Number(searchParams.get('pg')) || 1
    try {
        let user
        if (email) user = await prisma.user.findUnique({
            where: { email },
            include: {
                todos: {
                    orderBy: { createdAt: 'desc' },
                    take: itemsPerPg,
                    skip: (pg - 1) * itemsPerPg
                }
            }
        })
        return NextResponse.json({
            user,
            totalPgs: Math.ceil((email ? (user?.todos.length || 0) : 0) / itemsPerPg),
            currentPg: pg
        })
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { error: 'Failed to get User Details' },
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest) {
    const { userId } = auth()
    if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    try {
        const { email, isSubscribed, id, completed, title } = await req.json()
        if (isSubscribed !== undefined) await prisma.user.update({
            where: { email },
            data: {
                isSubscribed,
                subscriptionEnds: isSubscribed ? new Date(Date.now() + 3600000 * 720) : null
            }
        })
        if (id) await prisma.todo.update({
            where: { id },
            data: {
                // completed: completed !== undefined ? completed : undefined,
                completed: completed || undefined,
                title: title || undefined
            }
        })
        return NextResponse.json({ msg: 'Updated successfully' }, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ msg: 'Failed to update' }, { status: 500 })
    }
}