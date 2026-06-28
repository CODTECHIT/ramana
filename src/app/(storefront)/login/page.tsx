import React, { Suspense } from "react";
import { Constants } from "../../../lib/mock-data";
import LoginForm from "../../../components/LoginForm";

const { IVORY } = Constants;

export default function LoginPage() {
  return (
    <main
      style={{
        background: IVORY,
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Suspense
        fallback={<div className="w-full max-w-md p-8 my-10">Loading...</div>}
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
