import React from 'react'
import RecentFilesList from './recent-timeline'

const RecentContainer = () => {
  return (
    <div className='p-4 max-w-2xl mx-auto space-y-6'>
      <div className=''>
        {/* Recent files list will go here */}
        <RecentFilesList />
      </div>
    </div>
  )
}

export default RecentContainer