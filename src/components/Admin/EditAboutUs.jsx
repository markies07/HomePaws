import React, { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../firebase/firebase'
import close from './assets/close-dark.svg'
import { notifySuccessOrange } from '../General/CustomToast'

function EditAboutUs({ closeEdit }) {
    const [aboutData, setAboutData] = useState({
        mission: '',
        missionImage: '',
        values: '',
        valuesImage: '',
        goal: '',
        goalImage: ''
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchAboutData()
    }, [])

    const fetchAboutData = async () => {
        try {
            const docRef = doc(db, 'aboutUs', 'yXZx0xqCZacAzm4jidhB')
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setAboutData(docSnap.data())
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleImageChange = async (e, imageType) => {
        try {
            const file = e.target.files[0]
            if (!file) return

            setLoading(true)
            const storageRef = ref(storage, `aboutUs/${file.name}`)
            await uploadBytes(storageRef, file)
            const url = await getDownloadURL(storageRef)

            setAboutData(prev => ({
                ...prev,
                [imageType]: url
            }))
            setLoading(false)
        } catch (error) {
            console.error('Error uploading image:', error)
            setLoading(false)
        }
    }

    const handleTextChange = (e, field) => {
        setAboutData(prev => ({
            ...prev,
            [field]: e.target.value
        }))
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const docRef = doc(db, 'aboutUs', 'yXZx0xqCZacAzm4jidhB')
            await updateDoc(docRef, aboutData)
            setLoading(false)
            notifySuccessOrange('About us edited successfully!')
            closeEdit()
        } catch (error) {
            console.error('Error updating data:', error)
            setLoading(false)
        }
    }

    return (
        <div className={`fixed inset-0 flex w-full h-full justify-center items-center bg-secondary z-50 overflow-y-auto`}>
            <img 
                className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' 
                src={close} 
                alt="Close" 
                onClick={closeEdit}
            />
            <div className='w-full h-full flex flex-col items-center text-text py-10'>
                <p className='text-3xl font-medium border-b-2 px-5 border-text'>About Us</p>
                
                {/* CONTENT */}
                <div className='mt-10 lg:mt-14 w-full flex flex-col gap-10 lg:gap-0'>
                    {/* Mission Section */}
                    <div className='lg:flex w-full sm:w-[80%] mx-auto xl:w-[80%] 2xl:w-[70%] xl:mx-auto lg:h-80 h-auto xl:h-96'>
                        <div className='w-full relative sm:w-[70%] sm:h-72 lg:w-full lg:h-auto mx-auto overflow-hidden'>
                            <img className='w-full h-full object-cover' src={aboutData.missionImage} alt="Mission" />
                            <input 
                                type="file" 
                                id="missionImage" 
                                className="hidden" 
                                onChange={(e) => handleImageChange(e, 'missionImage')} 
                                accept="image/*"
                            />
                            <label 
                                htmlFor="missionImage" 
                                className='bg-text absolute bottom-3 right-3 text-sm px-4 cursor-pointer hover:bg-[#696969] duration-150 py-1 rounded-md text-white font-medium'
                            >
                                Change Image
                            </label>
                        </div>
                        <div className='text-center flex flex-col sm:justify-center lg:text-start mt-10 lg:m-0 w-full'>
                            <div className='pl-10'>
                                <p className='text-xl font-semibold mb-5 lg:mb-3'>Our Mission</p>
                                <textarea 
                                    className='py-1 outline-none w-full px-2 border-2 border-text rounded-md' 
                                    rows="5"
                                    value={aboutData.mission}
                                    onChange={(e) => handleTextChange(e, 'mission')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className='lg:flex w-full sm:w-[80%] mx-auto xl:w-[80%] 2xl:w-[70%] xl:mx-auto lg:h-80 h-auto xl:h-96'>
                        <div className='w-full relative lg:order-2 sm:w-[70%] sm:h-72 lg:w-full lg:h-auto mx-auto overflow-hidden'>
                            <img className='w-full h-full object-cover' src={aboutData.valuesImage} alt="Values" />
                            <input 
                                type="file" 
                                id="valuesImage" 
                                className="hidden" 
                                onChange={(e) => handleImageChange(e, 'valuesImage')} 
                                accept="image/*"
                            />
                            <label 
                                htmlFor="valuesImage" 
                                className='bg-text absolute bottom-3 right-3 text-sm px-4 cursor-pointer hover:bg-[#696969] duration-150 py-1 rounded-md text-white font-medium'
                            >
                                Change Image
                            </label>
                        </div>
                        <div className='text-center lg:order-1 flex flex-col sm:justify-center lg:text-end mt-10 lg:m-0 w-full'>
                            <div className='pr-10'>
                                <p className='text-xl font-semibold mb-5 lg:mb-3'>Our Values</p>
                                <textarea 
                                    className='py-1 outline-none w-full px-2 border-2 border-text rounded-md' 
                                    rows="5"
                                    value={aboutData.values}
                                    onChange={(e) => handleTextChange(e, 'values')}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Goal Section */}
                    <div className='lg:flex w-full sm:w-[80%] mx-auto xl:w-[80%] 2xl:w-[70%] xl:mx-auto lg:h-80 h-auto xl:h-96 mb-20'>
                        <div className='w-full relative sm:w-[70%] sm:h-72 lg:w-full lg:h-auto mx-auto overflow-hidden'>
                            <img className='w-full h-full object-cover' src={aboutData.goalImage} alt="Goal" />
                            <input 
                                type="file" 
                                id="goalImage" 
                                className="hidden" 
                                onChange={(e) => handleImageChange(e, 'goalImage')} 
                                accept="image/*"
                            />
                            <label 
                                htmlFor="goalImage" 
                                className='bg-text absolute bottom-3 right-3 text-sm px-4 cursor-pointer hover:bg-[#696969] duration-150 py-1 rounded-md text-white font-medium'
                            >
                                Change Image
                            </label>
                        </div>
                        <div className='text-center flex flex-col sm:justify-center lg:text-start mt-10 lg:m-0 w-full'>
                            <div className='pl-10'>
                                <p className='text-xl font-semibold mb-5 lg:mb-3'>Our Goal</p>
                                <textarea 
                                    className='py-1 outline-none w-full px-2 border-2 border-text rounded-md' 
                                    rows="5"
                                    value={aboutData.goal}
                                    onChange={(e) => handleTextChange(e, 'goal')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full text-center pb-10'>
                    <button 
                        className='bg-primary mt-2 px-4 self-center hover:bg-primaryHover duration-150 py-2 rounded-md text-white font-medium'
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditAboutUs