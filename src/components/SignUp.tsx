'use client';

import { authClient } from "@/lib/auth-client"; //import the auth client
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [full_name, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [phone_number, setPhoneNumber] = useState(0);

  var isTutor = false;

  const register = async () => {
    try {
      const { data, error } = await authClient.signUp.email(
        {
          email,
          password,
          name,
          full_name,
          role,
          phone_number,
        },
        {
          onSuccess: (ctx) => {
            router.push("/dashboard");
          },
          onError: (ctx) => {
            alert(ctx.error.message);
          },
        },
      );
      if (error) {
        console.error("Registration failed:", error);
      } else if (data) {
        console.log("User registered successfully:", data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "1rem", color: "#333" }}>Register</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setFullName(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <label style={{ display: "block", marginBottom: "1rem" }}>
          <input
            type="checkbox"
            onChange={(e) => {
              var trole = "student"; // temp var to store role
              if (e.target.checked) {
                trole = "tutor";
              }
              setRole(trole);
            }}
            style={{
              marginRight: "0.5rem",
            }}
          />
          Register as a tutor
        </label>
        <input
          type="text"
          placeholder="Other input field"
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <input
          type="tel"
          placeholder="phone number"
          pattern="/(7|8|9)\d{9}$/"
          onChange={(e) => {
            var num = Number(e.target.value);
            setPhoneNumber(num);
          }}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <button
          onClick={register}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
