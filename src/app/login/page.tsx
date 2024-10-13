import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSignIn } from "@clerk/nextjs"
import { Eye, EyeOff } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

const Page = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { isLoaded, setActive, signIn } = useSignIn()
  const router = useRouter()
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    try {
      const res = await signIn.create({
        identifier: email,
        password
      })
      if (res.status === 'complete') {
        await setActive({ session: res.createdSessionId })
        router.push('/dashboard')
      } else {
        console.log(res)

      }
    } catch (err: any) {
      console.log(err)
      setError(err.errors[0].message)
    }
  }
  return (
    !isLoaded ? null :
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Login to TODOhub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitHandler} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>
                <Input type='email' id='email' value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} id='password' value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ?
                      <EyeOff className="h-4 w-4 text-gray-500" />
                      :
                      <Eye className="h-4 w-4 text-gray-500" />
                    }
                  </button>
                </div>
              </div>
              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <Button className="w-full" type='submit'>
                Log In
              </Button>
            </form>
          </CardContent>
          <CardFooter className='justify-center'>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an Account?
              <Link href='/register' className='font-medium text-primary hover:underline'>
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
  )
}

export default Page