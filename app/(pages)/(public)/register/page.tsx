import { Metadata } from "next";
import RegisterClient from "./registerClient";

export const metadata: Metadata = {
  title: "Assessment tool - Register",
  description: "Made with love by Tecnod8",
};
export default function page() {
    return (
      <RegisterClient/>
    )
  }
  