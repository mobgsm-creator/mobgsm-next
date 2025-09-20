"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs,  TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";



export default function LoginForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("password");
  const [isPending, setIsPending] = useState(false);

  const [formData, setFormData] = useState({
    
      username: "",
      password: "",
   
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const res = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false, // Set to true if you want auto-navigation
      });
  
      if (res?.ok) {
        router.push("/"); // or your desired page
      } else {
        alert("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsPending(false);
    }
  };

  const handleOAuthLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/", redirect: true });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome to Mobgsm</CardTitle>
        <CardDescription>Purchase Airtime, Giftcards and Explore BNPL, Mobile Specs and ESIM information.</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="password" value={activeTab} onValueChange={setActiveTab} className="w-full">
          

          <TabsContent value="password" className="space-y-4">
            
              <form onSubmit={onSubmit} className="space-y-4">
              <Input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            className="w-full border rounded p-2 mb-4"
            placeholder="Enter username"
          />
          <Input
            type="text"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full border rounded p-2 mb-4"
            placeholder="Enter Password"
          />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>
                
              </form>
              <Button onClick={handleOAuthLogin} className="w-full" disabled={isPending}>
              {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in with Google"
                  )}
            </Button>
          </TabsContent>

          
        </Tabs>
      </CardContent>

      
    </Card>
  );
}
