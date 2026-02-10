import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Home, LinkIcon, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Button } from "./ui/button";
import { UrlState } from "@/context";

const Header = () => {
  const { loading, fn: fnLogout } = useFetch(logout);
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState();

  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        
        {/* Logo + Home */}
        <div className="flex flex-col items-start gap-2">
          <Link to="/">
            <img
              src="/logo.png"
              className="h-16 rounded-xl object-contain cursor-pointer"
              alt="TinyTRaIL Logo"
            />
          </Link>

          {/* Home Button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex gap-2 text-gray-700"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>

        {/* Right Side */}
        <div className="flex gap-4">
          {!user ? (
            <Button onClick={() => navigate("/auth")}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.profile_pic} />
                  <AvatarFallback>PA</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex items-center">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My Links
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    fnLogout().then(() => {
                      fetchUser();
                      navigate("/auth");
                    });
                  }}
                  className="text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>

      {loading && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
    </>
  );
};

export default Header;
