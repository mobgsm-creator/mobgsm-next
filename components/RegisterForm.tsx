"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
 
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { Loader2 } from "lucide-react";


export default function RegisterForm() {

  const [activeTab, setActiveTab] = useState("account");
  const [isPending, setIsPending] = useState(false);

  const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    try {
   
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await signIn("credentials", {
          username: formData.username,
          password: formData.password,
          callbackUrl: "/",
        });
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsPending(false);
    }
  };

  const handleOAuthRegister = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
  
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
          

          <TabsContent value="account">
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
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full border rounded p-2 mb-4"
            placeholder="Enter Email"
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
          <Input
            type="text"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
            className="w-full border rounded p-2 mb-4"
            placeholder="Confirm Password"
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
                <Button onClick={handleOAuthRegister} className="w-full">
              Continue with Google
            </Button>
              </form>
          </TabsContent>

        </Tabs>
      </CardContent>

      
    </Card>
  );
}
