import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/services/api";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
    throw redirect({ to: "/dashboard" });
  },
});
