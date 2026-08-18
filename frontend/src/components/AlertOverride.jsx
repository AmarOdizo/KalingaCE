"use client";

import { useEffect } from "react";
import Swal from "sweetalert2";

export default function AlertOverride() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.alert = (message) => {
        const msg = String(message).toLowerCase();
        let icon = "info";
        let title = "Notification";
        
        if (msg.includes("success")) {
          icon = "success";
          title = "Success";
        } else if (
          msg.includes("fail") ||
          msg.includes("error") ||
          msg.includes("wrong") ||
          msg.includes("invalid")
        ) {
          icon = "error";
          title = "Error";
        } else if (
          msg.includes("warning") ||
          msg.includes("please") ||
          msg.includes("select") ||
          msg.includes("enter") ||
          msg.includes("choose")
        ) {
          icon = "warning";
          title = "Attention";
        }

        Swal.fire({
          title: title,
          text: String(message),
          icon: icon,
          confirmButtonColor: "#3b82f6",
        });
      };
    }
  }, []);

  return null;
}
