"use client";
import FilesDataTable from "@/components/custom/datatable";
import React from "react";
import { sampleData } from "../dashboard/dummy-data";

const DocumentsContainer = () => {
  return (
    <div className="w-full p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">
          Documents
        </h2>
        <p className="text-muted-foreground">
          Manage and organize your documents efficiently
        </p>
      </div>
      <div>
        <FilesDataTable
          data={sampleData}
          uploadlink="/documents/upload"
          buttonText="Upload Document"
        />
      </div>
    </div>
  );
};

export default DocumentsContainer;
