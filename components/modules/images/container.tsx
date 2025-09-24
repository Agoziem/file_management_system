"use client";
import FilesDataTable from '@/components/custom/datatable'
import React from 'react'
import { sampleData } from '../dashboard/dummy-data'

const ImagesContainer = () => {
  return (
    <div className="w-full p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight dark:text-white">Images</h2>
        <p className="text-muted-foreground">
          Manage and organize your images efficiently
        </p>
      </div>
      <div>
        <FilesDataTable data={sampleData} uploadlink="/images/upload" buttonText="Upload Image" />
      </div>
    </div>
  )
}

export default ImagesContainer