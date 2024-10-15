import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) return NextResponse.json({ error: 'User not Found' }, { status: 404 })
        // payment
        const subscriptionEnds = new Date()
        subscriptionEnds.setMonth(subscriptionEnds.getMonth() + 1)
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                subscriptionEnds,
                isSubscribed: true
            }
        })
        return NextResponse.json(
            {
                msg: 'Subscribed Successfully',
                subscriptionEnds: updatedUser.subscriptionEnds
            },
            { status: 200 }
        )
    } catch (err) {
        console.log('Subscription Failed', err)
        return NextResponse.json({ error: 'Subscription error' }, { status: 500 })
    }
}

export async function GET() {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                isSubscribed: true,
                subscriptionEnds: true
            }
        })
        if (!user) return NextResponse.json({ error: 'User not Found' }, { status: 404 })
        const now = new Date()
        if (user.subscriptionEnds && user.subscriptionEnds < now) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isSubscribed: false,
                    subscriptionEnds: null
                }
            })
            return NextResponse.json({
                isSubscribed: false,
                subscriptionEnds: null
            })
        }
        return NextResponse.json({
            isSubscribed: user.isSubscribed,
            subscriptionEnds: user.subscriptionEnds
        })
    } catch (err) {
        console.log('Failed to get Subscription Details', err)
        return NextResponse.json({ error: 'Subscription Fetch error' }, { status: 500 })
    }
}