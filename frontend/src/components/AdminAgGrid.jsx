"use client";

import { useEffect, useState } from "react";
import { themeQuartz, colorSchemeDark, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import dynamic from "next/dynamic";

// Register all community features globally
ModuleRegistry.registerModules([AllCommunityModule]);

const AgGridReact = dynamic(
  () => import("ag-grid-react").then((mod) => mod.AgGridReact),
  { ssr: false }
);

// Custom premium theme parameter configuration
const lightTheme = themeQuartz.withParams({
  accentColor: "#4f46e5", // Indigo 600
  headerBackgroundColor: "#f8fafc", // Slate 50
  headerTextColor: "#475569", // Slate 600
  rowHoverColor: "#f1f5f9", // Slate 100
  borderColor: "#e2e8f0", // Slate 200
  fontFamily: "var(--font-sans), sans-serif",
});

const darkTheme = themeQuartz.withPart(colorSchemeDark).withParams({
  accentColor: "#6366f1", // Indigo 500
  headerBackgroundColor: "#0f172a", // Slate 900
  headerTextColor: "#94a3b8", // Slate 400
  rowHoverColor: "#1e293b", // Slate 800
  borderColor: "#1e293b", // Slate 800
  fontFamily: "var(--font-sans), sans-serif",
});

export default function AdminAgGrid({ rowData, columnDefs, quickFilterText, ...props }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains("dark"));
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ height: "550px", width: "100%" }} className="w-full">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        theme={isDark ? darkTheme : lightTheme}
        quickFilterText={quickFilterText}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        suppressCellFocus={true}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          minWidth: 80,
          cellClass: "flex items-center", // Vertical centering for custom renderers
        }}
        {...props}
      />
    </div>
  );
}
