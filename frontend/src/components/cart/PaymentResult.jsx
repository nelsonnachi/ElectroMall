import React from "react";
import { Link } from "react-router-dom";

const PaymentResult = ({ status }) => {
  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div
          className={`inline-flex h-14 w-14 items-center justify-center rounded-full ${isSuccess ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
        >
          {isSuccess ? "✓" : "!"}
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-900">
          {isSuccess ? "Payment successful" : "Payment cancelled"}
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          {isSuccess
            ? "Your order has been recorded and payment was verified."
            : "The payment was cancelled before completion."}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/my/orders"
            className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            View My Orders
          </Link>
          <Link 
            to="/shop"
            className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
