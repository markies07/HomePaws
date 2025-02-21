import React, { useEffect, useState } from 'react'
import { db } from '../../firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'

function AboutUs() {
    const [aboutData, setAboutData] = useState({
        mission: '',
        missionImage: '',
        values: '',
        valuesImage: '',
        goal: '',
        goalImage: ''
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const docRef = doc(db, 'aboutUs', 'yXZx0xqCZacAzm4jidhB')
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setAboutData(docSnap.data())
                }
            } catch (error) {
                console.error('Error fetching about data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAboutData()
    }, [])

    if (loading) {
        return <div className="w-full h-screen flex justify-center items-center">
            <p className="text-xl">Loading...</p>
        </div>
    }

    return (
        <div className='w-full h-full flex flex-col items-center text-text sm:my-10 sm:mt-20 bg-secondary'>
            <p className='text-3xl font-medium border-b-2 px-5 border-text'>About Us</p>
            
            {/* CONTENT */}
            <div className='mt-10 lg:mt-14 flex flex-col gap-10 lg:gap-0'>
                <div className='lg:flex w-full sm:w-[80%] mx-auto xl:w-[80%] 2xl:w-[70%] xl:mx-auto lg:h-80 h-auto xl:h-96 '>
                    <div className='w-full sm:w-[70%] sm:h-72 lg:w-full lg:h-auto mx-auto overflow-hidden'>
                        <img className='w-full h-full object-cover' src={aboutData.missionImage} alt="Our Mission" />
                    </div>
                    <div className='text-center flex flex-col sm:justify-center lg:text-start mt-10 lg:m-0 w-full'>
                        <p className='text-xl font-semibold mb-5 lg:mb-3 px-7 lg:pl-10'>Our Mission</p>
                        <p className='leading-7 font-light px-7 lg:pl-10'>{aboutData.mission}</p>
                    </div>
                </div>

                <div className='lg:flex w-full sm:w-[80%] mx-auto xl:w-[80%] 2xl:w-[70%] xl:mx-auto lg:h-80 h-auto xl:h-96 '>
                    <div className='w-full lg:order-2 sm:w-[70%] sm:h-72 lg:w-full lg:h-auto mx-auto overflow-hidden'>
                        <img className='w-full h-full object-cover' src={aboutData.valuesImage} alt="Our Values" />
                    </div>
                    <div className='text-center lg:order-1 flex flex-col sm:justify-center lg:text-end mt-10 lg:m-0 w-full'>
                        <p className='text-xl font-semibold mb-5 lg:mb-3 px-7 lg:pr-10'>Our Values</p>
                        <p className='leading-7 font-light px-7 lg:pr-10'>{aboutData.values}</p>
                    </div>
                </div>
                
                <div className='lg:flex w-full sm:w-[80%] mx-auto xl:w-[80%] 2xl:w-[70%] xl:mx-auto lg:h-80 h-auto xl:h-96 '>
                    <div className='w-full sm:w-[70%] sm:h-72 lg:w-full lg:h-auto mx-auto overflow-hidden'>
                        <img className='w-full h-full object-cover' src={aboutData.goalImage} alt="Our Goal" />
                    </div>
                    <div className='text-center flex flex-col sm:justify-center lg:text-start mt-10 lg:m-0 w-full'>
                        <p className='text-xl font-semibold mb-5 lg:mb-3 px-7 lg:pl-10'>Our Goal</p>
                        <p className='leading-7 font-light px-7 lg:pl-10'>{aboutData.goal}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs