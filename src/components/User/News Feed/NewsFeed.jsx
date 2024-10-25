import React, { useState } from 'react'
import Actions from './Actions'
import Posts from './Posts'
import CreatePost from './CreatePost'

function NewsFeed() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [postType, setPostType] = useState('story');

  const openCreatePost = (type) => {
      setIsCreatePostOpen(!isCreatePostOpen);
      setPostType(type);
  }
  const closeCreatePost = () => {
    setIsCreatePostOpen(!isCreatePostOpen);
  }

  return (
    <div className='pt-36 lg:pt-20 lg:pl-48 z-30 xl:pl-[13.8rem] lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
      <div className='w-full h-full'>
        <div className='order-1 lg:order-2'>
          <Actions open={openCreatePost} />
        </div>
        <div className='order-2 lg:order-1 justify-center flex flex-col gap-3 mx-auto lg:mx-0 mt-3 mb-4 lg:my-3 w-full sm:w-[90%] lg:pr-[14.2rem] lg:w-full'>
          <Posts />
        </div>
        <div className={isCreatePostOpen ? 'block' : 'hidden'}>
          <CreatePost postType={postType} closeWindow={closeCreatePost} />
        </div>
      </div>
    </div>
  )
}

export default NewsFeed