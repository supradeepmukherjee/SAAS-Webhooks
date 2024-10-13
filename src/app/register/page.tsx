import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSignUp } from "@clerk/nextjs"
import { Eye, EyeOff } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

const Page = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationPending, setVerificationPending] = useState(false)
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { isLoaded, setActive, signUp } = useSignUp()
  const router = useRouter()
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    try {
      await signUp.create({
        emailAddress: email,
        password
      })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setVerificationPending(true)
    } catch (err: any) {
      console.log(err)
      setError(err.errors[0].message)
    }
    const verifyHandler = async (e: FormEvent) => {
      e.preventDefault()
      if (!isLoaded) return
      try {
        const { status, createdSessionId } = await signUp.attemptEmailAddressVerification({ code })
        if (status !== 'complete') {
          // 
          return
        }
        await setActive({ session: createdSessionId })
        router.push('/dashboard')
      } catch (err: any) {
        console.log(err)
        setError(err.errors[0].message)
      }
    }
  }
  return (
    !isLoaded ? null :
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Sign Up on TODOhub
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!verificationPending ? (
              <form onSubmit={submitHandler} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email
                  </Label>
                  <Input type='email' id='email' value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Email
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
                  Sign Up
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={submitHandler}>
                <div className="space-y-2">
                  <Label htmlFor='code'>
                    Verification Code
                  </Label>
                  <Input id='code' value={code} onChange={e => setCode(e.target.value)} placeholder='Enter verification code' required />
                </div>
                {error && (
                  <Alert variant='destructive'>
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                <Button className="w-full" type='submit'>
                  Verify Email
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className='justify-center'>
            <p className="text-sm text-muted-foreground">
              Already have an Account?
              <Link href='/login' className='font-medium text-primary hover:underline'>
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
  )
}

export default Page