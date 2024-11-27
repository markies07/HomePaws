import React from 'react'
import close from './assets/close.svg'

function FAQs({closeFaqs}) {
    return (
        <div className='fixed z-10 right-0 top-0 px-5 py-5 sm:px-10 sm:py-10 bg-secondary min-h-screen max-h-screen overflow-auto w-full flex flex-col text-text font-poppins'>
            <div className='absolute top-4 right-4 border-2 border-secondary hover:border-primary cursor-pointer p-1 duration-150'>
                <img onClick={closeFaqs} src={close} alt="" />
            </div>

            <p className='text-3xl font-medium mt-10 sm:mt-0 text-center sm:text-start'>Frequently Asked Questions</p>

            {/* QUESTIONS */}
            <div className='mt-10'>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>What is HomePaws?</p>
                    <p>HomePaws is a pet adoption platform designed to connect pets in need of loving homes with responsible caregivers. It also includes a social media feature where pet owners can share updates about their pets.</p>
                </div>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>How do I adopt a pet on HomePaws?</p>
                    <p>To adopt a pet, simply browse the pets available for adoption in your area, view their profiles, and submit an adoption application. The pet owner will review your application and contact you.</p>
                </div>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>How can I post a pet for adoption?</p>
                    <p>If you’re a pet owner, you can create an account, upload the pet's details and photos, and list them for adoption. Make sure to include accurate information about the pet to help potential adopters make informed decisions.</p>
                </div>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>Is HomePaws free to use?</p>
                    <p>Yes, HomePaws is free to use for browsing pets, creating a profile, and posting adoption listings. However, other pet owner may have their own adoption fees or requirements.</p>
                </div>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>Can I reactivate a deactivated account?</p>
                    <p>Yes, if your account is deactivated, you can submit a reactivation request. Ensure that you’ve resolved any issues that may have led to the deactivation.</p>
                </div>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>How does HomePaws ensure pet safety?</p>
                    <p>We verify users and encourage transparency in adoption processes. Additionally, our reporting feature allows the community to flag any concerns about pets or users.</p>
                </div>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>Who can I contact for support?</p>
                    <p>For assistance, you can reach out to our support team through the Contact Us section on the platform.</p>
                </div>
            </div>

        </div>
    )
}

export default FAQs