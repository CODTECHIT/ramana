import React, { Suspense } from "react";
import { Constants } from "../../../lib/mock-data";
import RegisterForm from "../../../components/RegisterForm";

const { IVORY } = Constants;

export default function RegisterPage() {
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
        <RegisterForm />
      </Suspense>
    </main>
  );
}
