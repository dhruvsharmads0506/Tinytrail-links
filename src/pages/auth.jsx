import React, { use } from 'react'
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import Login from '../components/ui/login';
import Signup from '../components/ui/signup';

const Auth = () => {
  const [searchParams] = useSearchParams();
  return (
  <div className="mt-36 flex flex-col items-center justify-center gap-10">
    <h1 className="text-5xl font-extrabold">
      {searchParams.get("createNew")
        ? "Hold up! Let's login first...."
        : "Login / Signup"}
    </h1>

    <Tabs defaultValue="login" className="w-[400px] flex flex-col items-center">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Signup</TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="text-center">
       <Login/>
      </TabsContent>

      <TabsContent value="signup" className="text-center">
        <Signup/>
      </TabsContent>
    </Tabs>
  </div>
);

};

export default Auth;