"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  type: string;
  password: string;
}

function RegisterClient() {
  // const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    type: "",
    password: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          type: "",
          password: "",
        });
        alert("User added successfully!");
      } else {
        alert("Failed to add user. Please try again later.");
      }
    } catch (error) {
      alert(error);
      console.error("Error submitting form:", error);
    }
  };

  // const onSubmit = async (data: any) => {
  //   data.preventDefault();

  //   console.log(data);
  //   const response = await fetch("/api/auth/register", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });

  //   if (!response.ok) {
  //     throw new Error("Network response was not ok");
  //   }

  //   const responseData = await response.json();
  //   console.log(responseData);
  //   // router.push("../dashboard")
  // };

  return (
    <div>
      <section className="body-font mx-auto max-w-7xl">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
          <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <Image
              height={1000}
              width={1000}
              src="https://source.unsplash.com/random/1000x1000?student"
              alt=""
              className="object-top w-full rounded-md xl:col-span-3 bg-gray-500 object-cover shadow-md max-h-[70vh]"
            />
          </div>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="lg:w-2/6 md:w-1/2  rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0"
          >
            <h2 className=" text-lg font-medium title-font mb-5">Sign Up</h2>
            <div className="relative mb-4">
              <Label htmlFor="full-name" className="leading-7 text-sm">
                Full Name
              </Label>
              <Input
                type="text"
                id="name"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="relative mb-4">
              <Label htmlFor="email" className="leading-7 text-sm">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
              />
            </div>{" "}
            <div className="relative mb-4 space-y-2">
              <Label htmlFor="type" className="leading-7 text-sm">
                Type
              </Label>
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="seeker"
                  name="type"
                  value="seeker"
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                  defaultChecked
                  onChange={handleChange}
                />
                <label htmlFor="seeker" className="text-sm">
                  Seeker
                </label>

                <input
                  type="radio"
                  id="recruiter"
                  name="type"
                  value="recruiter"
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                  onChange={handleChange}
                />
                <label htmlFor="recruiter" className="text-sm">
                  Recruiter
                </label>
              </div>
            </div>
            <div className="relative mb-4">
              <Label htmlFor="password" className="leading-7 text-sm">
                Password
              </Label>
              <Input
                type="password"
                required
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <Button type="submit" className="py-2 px-8 w-full">
              Sign Up
            </Button>
            <p className="text-xs text-center  mt-3">Sign Up to continue!</p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default RegisterClient;
