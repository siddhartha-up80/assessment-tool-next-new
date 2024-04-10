"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Grid, Typography } from "@mui/material";
import cardimg from "../../../assests/cardimg.png";
import styles from "./login.module.css";
import Image from "next/image";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Link from "next/link";

interface IFormInput {
  email: string;
  password: string;
}

const LoginClient = () => {
  const router = useRouter();
  const schema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid email"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInput) => {
    console.log(data);
    router.push("/");
  };

  return (
    <>
      <div className={styles.mainsec}>
        <div className={styles.sec}>
          <div className={styles.left}>
            {/* <Navbar /> */}
            <div className={styles.cardsec}>
              <div className={styles.card}>
                {/* <Image href={cardimg} alt="" /> */}
                <h2>New to Tecnod8</h2>
                <div className={styles.cardinfo}>
                  <p>
                    <b>1.</b>One click apply using your profile.
                  </p>
                  <p>
                    <b>2.</b>Get relevant job recommendations.
                  </p>
                  <p>
                    <b>3.</b>Know application status on applied jobs.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.formsec}>
              <div>
                <h2>Login</h2>
              </div>
              <TextField id="outlined-basic" label="Outlined" variant="outlined" />
              <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                      fullWidth
                      label="Email"
                      {...register("email")}
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      onBlur={() => trigger("email")}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      {...register("password")}
                      variant="outlined"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      onBlur={() => trigger("password")}
                    />
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </form>
              {/* <Link href="../register">Don't have account</Link> */}
              <br />
              <div>
                {/* <button onClick={handleGoogleSignIn} className={styles.google}><i class="fa-brands fa-google"/>Sign in with Google</button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginClient;