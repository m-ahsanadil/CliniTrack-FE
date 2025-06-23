"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shield } from "lucide-react";
import { useAppSelector } from "../store/reduxHook";

export const ProtectedRoleGuard = ({
  dashboardId,
  role,
  children,
}: {
  dashboardId: string | number;
  role: string;
  children: React.ReactNode;
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const isVerified = user?.id === dashboardId && user?.role === role;

  useEffect(() => {
    if (user && !isVerified) {
    //   router.replace("/unauthorized");
    }
  }, [user, isVerified, router]);

  if (!isVerified) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Access Denied
        </h3>
        <p className="text-slate-600">
          You are not authorized to access this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
