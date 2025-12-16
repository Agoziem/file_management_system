"use client";
import React from 'react'
import RecentFilesList from './recent-timeline'

const RecentContainer = () => {
  return (
    <div className='p-3 sm:p-4 md:p-6'>
        {/* Recent files list will go here */}
        <RecentFilesList />
    </div>
  )
}

export default RecentContainer