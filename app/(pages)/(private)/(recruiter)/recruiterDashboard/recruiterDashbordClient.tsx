"use client";
import React from "react";
import styles from "./rdashboard.module.css";
import Link from "next/link";
import Image from "next/image";
import { tAssessmentCard } from "./../../../../types/tassessment";
import AssessmentCard from "@/app/components/AssessmentCard";
import { AccountCircle, Business, Add, ExitToApp } from "@mui/icons-material";

function RecruiterDashbordClient() {
  const userinfo = {
    fullname: "abhay madaan",
    emailid: "madaanabhay9@gmail.com",
  };
  const sampleAssessment: tAssessmentCard = {
    name: "Sample Assessment",
    taken: "12",
    role: "Software Engineer",
    industry: "Technology",
    company: "Sample Company",
    experience: "3 years",
    score: 85,
    requiredSkills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
  };
  return (
    <>
      <div className={styles.mainsec}>
        <div className={styles.sec}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <Link
                href="/"
                style={{ textDecoration: "none", color: "white" }}
              ></Link>
            </div>
            <div className={styles.info}>
              <h2>User Details</h2>
              <div className={styles.item}>
                <AccountCircle /> <span>{userinfo.fullname}</span>
              </div>
              <div className={styles.item}>
                <Business /> <span>{userinfo.emailid}</span>
              </div>
              <div className={styles.item}>
                <Add /> <span>CREATE ASSESSMENT</span>
              </div>
              <div className={styles.item}>
                <ExitToApp /> <span>LOGOUT</span>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <h2>Dashboard</h2>
            <AssessmentCard assessment={sampleAssessment} />
            <AssessmentCard assessment={sampleAssessment}/>
          <AssessmentCard assessment={sampleAssessment}/>
          <AssessmentCard assessment={sampleAssessment}/>
          <AssessmentCard assessment={sampleAssessment}/>
          <AssessmentCard assessment={sampleAssessment}/>
          <AssessmentCard assessment={sampleAssessment}/>
          <AssessmentCard assessment={sampleAssessment}/>
          </div>
        </div>
      </div>
    </>
  );
}
export default RecruiterDashbordClient;
