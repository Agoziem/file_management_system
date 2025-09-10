import React from 'react'
import { CgSpinner } from 'react-icons/cg'

const loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <CgSpinner className="animate-spin text-5xl" />
    </div>
  )
}

export default loading