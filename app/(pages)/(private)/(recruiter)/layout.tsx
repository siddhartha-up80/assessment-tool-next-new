"use client"
import { Inter } from "next/font/google";
import "../../../globals.css";
import { getLocalStorageItem } from "@/app/services/localStorageService";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

  
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
//   const router = useRouter()
//   const userInfo = getLocalStorageItem("user");
//   if(!userInfo) router.push('../../register')
//   else 
// {
//   //check if the user is authenticated
//   const {jwtToken} = userInfo;
//   const isRecruiter = true//call api to check if this token is valid or not
//   if(!isRecruiter) router.push('../../login')
  
// }
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
