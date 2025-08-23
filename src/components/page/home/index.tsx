"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { DownloadIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/utils/validation/auth";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { DOWNLOAD_USER_ENDPOINT } from "@/lib/constants/endpoints/download-user";

type FormValue = {
  email: string;
};

export default function Home() {
  const images = ["/assets/mockup/home-1.png", "/assets/mockup/home-2.png"];
  const [imageIndex, setImageIndex] = useState(0);

  const form = useForm<FormValue>({
    resolver: zodResolver(authSchema.pick({ email: true })),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["download user"],
    mutationFn: (data: FormValue) =>
      http.post<{ url: string }>(
        DOWNLOAD_USER_ENDPOINT.POST_DOWNLOAD_APK,
        data,
      ),
    onSuccess: (data) => {
      if (data.success) {
        if (data.data) {
          const url = data.data.url || "";
          window.location.href = url;
          form.reset();
          return data.data;
        }
      }
      return data;
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const onSubmit: SubmitHandler<FormValue> = (data) => mutate(data);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black text-gray-900 dark:text-white flex flex-col justify-center">
      <section className="container mx-auto h-full flex flex-col md:flex-row items-center justify-between px-6 py-40 md:py-16 gap-10 md:gap-16">
        {/* Text content */}
        <div className="max-w-xl md:max-w-2xl text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Meet{" "}
            <span className="text-indigo-600">{env.NEXT_PUBLIC_APP_NAME}</span>
            <br /> Your Smart Companion 🚀
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-md md:max-w-none mx-auto md:mx-0">
            A modern mobile app designed to help you manage tasks, stay
            productive, and simplify your digital life — fast, secure, and
            beautiful.
          </p>

          {/* Email form */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 flex h-full flex-col sm:flex-row items-start gap-4 max-w-md mx-auto md:mx-0 w-full"
            noValidate
          >
            <Form {...form}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full min-h-[88px]">
                    <FormControl>
                      <Input
                        {...field}
                        aria-invalid={!!form.formState.errors.email}
                        placeholder="Enter your email to get the app"
                        type="email"
                        autoComplete="email"
                        className="h-14 border border-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 w-full"
                      />
                    </FormControl>
                    {form.formState.errors.email ? (
                      <FormMessage className="text-xs mt-1 text-red-600">
                        {form.formState.errors.email.message}
                      </FormMessage>
                    ) : (
                      <FormDescription>
                        Enter your email to get the app
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
            </Form>
            <div className="flex w-full md:justify-start justify-center h-14 items-center">
              <Button
                disabled={isPending || !form.formState.isDirty}
                type="submit"
                className="flex items-center w-full justify-center py-8 px-8 text-white bg-indigo-600 hover:bg-indigo-700 text-lg font-semibold rounded-lg min-w-[140px] transition shrink-0"
              >
                {isPending ? (
                  "Downloading"
                ) : (
                  <>
                    <DownloadIcon className="mr-2" />
                    Download App
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* App mockup */}
        <div className="flex justify-center md:justify-end w-full max-w-md md:max-w-lg mx-auto">
          <Image
            src={images[imageIndex]}
            alt="App mockup"
            width={600}
            height={1200}
            priority
            style={{
              maxHeight: 900,
              width: "auto",
              height: "auto",
            }}
            className="drop-shadow-2xl rounded-2xl"
          />
        </div>
      </section>
    </div>
  );
}
