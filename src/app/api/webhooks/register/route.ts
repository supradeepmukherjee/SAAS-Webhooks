import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
    if (!WEBHOOK_SECRET) throw new Error('No WebHook Secret')
    const headerPayload = headers()
    const svixID = headerPayload.get('svix-id')
    const svixTimestamp = headerPayload.get('svix-timestamp')
    const svixSignature = headerPayload.get('svix-signature')
    if (!svixID || !svixTimestamp || !svixSignature) return new Response('svix headers error')
    const payload = await req.json()
    const body = JSON.stringify(payload)
    const wh = new Webhook(WEBHOOK_SECRET)
    let event: WebhookEvent
    try {
        event = wh.verify(body, {
            "svix-id": svixID,
            "svix-signature": svixSignature,
            "svix-timestamp": svixTimestamp
        }) as WebhookEvent
    } catch (err) {
        console.log('Error verifying webhook', err)
        return new Response('Error verifying webhook', { status: 400 })
    }
    const { id } = event.data
    const eventType = event.type
    if (eventType === 'user.created') {
        try {
            const { email_addresses, primary_email_address_id } = event.data
            const primaryEmail = email_addresses.find(({ id }) => id === primary_email_address_id) // optional
            if (!primaryEmail) return new Response('No Primary Email ID found', { status: 400 })
            await prisma.user.create({
                data: {
                    id: id!,
                    email: primaryEmail.email_address,
                    isSubscribed: false
                }
            })
        } catch (err) {
            return new Response('Error creating user in database', { status: 400 })
        }
    }
    return new Response('Webhook received', { status: 200 })
}