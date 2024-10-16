import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Clock, List, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
	const { userId } = auth()
	if (userId) redirect('/dashboard')
	return (
		<div className="flex flex-col min-h-screen from-background to-primary/10 bg-gradient-to-b">
			<div className="container flex-grow px-4 py-12 mx-auto">
				<Card className="mb-12 border-none from-primary/20 to-secondary/20 bg-gradient-to-r">
					<CardHeader>
						<CardTitle className="text-center text-transparent text-5xl font-extrabold from-primary to-secondary bg-gradient-to-r bg-clip-text">
							Welcome to TODOhub
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-center mb-8 text-muted-foreground text-xl">
							TODOhub - Stay Organized, Achieve More – Your Tasks Simplified!
						</p>
						<div className="flex justify-center space-x-6">
							<Button asChild size='lg' className="text-lg">
								<Link href='/register'>
									Start for Free
								</Link>
							</Button>
							<Button asChild size='lg' className="text-lg" variant='outline'>
								<Link href='/login'>
									Login
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
				<Card className="mb-12 border-none">
					<CardHeader>
						<CardTitle className="text-center text-primary text-3xl font-bold">
							Efficient Task Management with valuable Features
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid md:grid-cols-3 gap-8">
							<div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
								<List className="h-16 w-16 text-primary mb-4" />
								<h4 className="text-xl font-semibold mb-3">
									Smart Organisation
								</h4>
								<p className="text-muted-foreground">
									Categorise & Schedule Tasks with our easy-to-use Interface
								</p>
							</div>
							<div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
								<Clock className="h-16 w-16 text-primary mb-4" />
								<h4 className="text-xl font-semibold mb-3">
									Unforgettable Reminders
								</h4>
								<p className="text-muted-foreground">
									Never miss Deadlines with our reminders which will try to make tasks unforgettable for you
								</p>
							</div>
							<div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
								<Users className="h-16 w-16 text-primary mb-4" />
								<h4 className="text-xl font-semibold mb-3">
									Effortless Collaboration
								</h4>
								<p className="text-muted-foreground">
									Work Collectively and complete tasks at a Rapid Pace
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="mb-12 border-none from-primary/20 to-secondary/20 bg-gradient-to-r">
					<CardHeader>
						<CardTitle className="text-3xl font-bold text-center">
							What our Users say
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid md:grid-cols-2 gap-6">
							<blockquote className="italic text-lg text-muted-foreground">
								&ldquo;TODOhub has transformed the way our team manages projects. It&apos;s intuitive, powerful, and valuable!&rdquo;
								<footer className="text-right font-semibold mt-2">
									Suresh Bhai., Project Manager
								</footer>
							</blockquote>
							<blockquote className="italic text-lg text-muted-foreground">
								&ldquo;I&apos;ve tried many task management apps, but TODOhub is by far the best. It&apos;s boosted my productivity tenfold!&rdquo;
								<footer className="text-right font-semibold mt-2">
									Desi Vyapari., Founder
								</footer>
							</blockquote>
						</div>
					</CardContent>
				</Card>
			</div>
			<footer className="bg-muted py-8">
				<div className="flex flex-col md:flex-row justify-between items-center container px-4 mx-auto">
					<div className="flex justify-center space-x-6 mb-4 md:mb-0">
						<a href="https://github.com/supradeepmukherjee" className="text-muted-foreground hover:text-primary transition-colors">
							<span className="sr-only">
								Github
							</span>
							<GitHubLogoIcon className='h-8 w-8' />
						</a>
						<a href="https://twitter.com/supradeep2004" className="text-muted-foreground hover:text-primary transition-colors">
							<span className="sr-only">
								Twitter
							</span>
							<TwitterLogoIcon className='h-8 w-8' />
						</a>
						<a href="https://www.linkedin.com/in/supradeep-mukherjee/" className="text-muted-foreground hover:text-primary transition-colors">
							<span className="sr-only">
								Linkedin
							</span>
							<LinkedInLogoIcon className='h-8 w-8' />
						</a>
					</div>
					<p className="text-center text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} TODOhub. All Rights Reserved
						<Link href='/privacy' className='hover:underline'>
							Privacy Policy
						</Link>
						|
						<Link href='/terms' className='hover:underline'>
							Terms of Service
						</Link>
					</p>
				</div>
			</footer>
		</div>
	)
}