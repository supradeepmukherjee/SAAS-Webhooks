import { useClerk, useUser } from "@clerk/nextjs"
import { CreditCard, LogOut } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

const Navbar = () => {
  const { user } = useUser()
  const { signOut } = useClerk()
  return (
    <nav className="bg-background border-p">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href='/' className="flex items-center flex-shrink-0">
              <span className="ml-2 text-xl font-bold">
                TODOhub
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className="relative h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.imageUrl} alt='User Chavi' />
                      <AvatarFallback>
                        {user.firstName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href='/subscribe' className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>
                        Subscribe
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>
                      Sign Out
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ):(
              <>
                <Button variant='ghost' asChild className="mr-2">
                  <Link href='/login'>
                    Login
                  </Link>
                </Button>
                <Button variant='outline' asChild>
                  <Link href='/register'>
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar