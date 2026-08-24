"use client";

import { useEffect, useState } from "react";
import { themeQuartz, colorSchemeDark, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import dynamic from "next/dynamic";
import { Download } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains("dark"));
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleExportCSV = () => {
    if (!rowData || rowData.length === 0) return;

    // Filter out actions or empty columns or image/thumbnail columns
    const excludedHeaders = ["Actions", "Image", "Thumbnail", "Cover", "Logo", "Poster", "Banner", "Icon", "Avatar", "Photo"];
    const columnsToExport = (columnDefs || []).filter(
      (col) => col.headerName && !excludedHeaders.includes(col.headerName)
    );

    // Header row
    const headers = columnsToExport.map((col) => col.headerName);

    // Data rows
    const rows = rowData.map((row, rowIndex) => {
      return columnsToExport.map((col) => {
        let value = "";
        if (col.valueGetter) {
          if (typeof col.valueGetter === "function") {
            value = col.valueGetter({ data: row, node: { rowIndex } });
          } else if (typeof col.valueGetter === "string") {
            if (col.valueGetter === "node.rowIndex + 1") {
              value = rowIndex + 1;
            } else {
              value = row[col.field];
            }
          }
        } else if (col.valueFormatter) {
          const rawValue = col.field ? row[col.field] : undefined;
          value = col.valueFormatter({ value: rawValue, data: row });
        } else if (col.field) {
          value = row[col.field];
        }

        // Handle objects/nested values
        if (typeof value === "object" && value !== null) {
          value = value.courseName || value.name || value.title || JSON.stringify(value);
        }

        const valStr = value !== undefined && value !== null ? String(value) : "";
        // Escape double quotes
        const escaped = valStr.replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const title = typeof document !== "undefined" && document.title 
      ? document.title.split("|")[0].trim().toLowerCase().replace(/\s+/g, "-") 
      : "admin-data";
    const filename = `${title}-${new Date().toISOString().slice(0, 10)}.csv`;
    
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isButtonDisabled = !rowData || rowData.length === 0 || props.loading;

  if (!mounted) {
    return (
      <div style={{ height: "550px", width: "100%" }} className="w-full bg-slate-50/50 dark:bg-slate-900/20 animate-pulse rounded-2xl flex items-center justify-center text-xs font-bold text-slate-400/80 border border-slate-200/50 dark:border-slate-800/40">
        Loading Grid System...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-end items-center px-1">
        <button
          onClick={handleExportCSV}
          disabled={isButtonDisabled}
          className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-[1.5px] text-xs font-bold text-white shadow-lg transition-all duration-300 ${
            isButtonDisabled
              ? "opacity-40 cursor-not-allowed"
              : "hover:-translate-y-0.5 hover:shadow-indigo-500/20 active:scale-[0.98] cursor-pointer"
          }`}
        >
          <span className={`relative flex items-center gap-2 rounded-[11px] bg-white text-slate-800 dark:bg-slate-950 dark:text-white px-4 py-2.5 transition-all duration-300 ${
            isButtonDisabled 
              ? "" 
              : "group-hover:bg-transparent group-hover:text-white"
          }`}>
            <Download size={14} className={`transition-colors duration-300 ${
              isButtonDisabled
                ? "text-slate-400"
                : "text-indigo-600 dark:text-indigo-400 group-hover:text-white"
            }`} />
            <span>Export CSV</span>
          </span>
        </button>
      </div>
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
    </div>
  );
}
