import React from 'react'
import close from '../../assets/icons/close-dark.svg'



function TermsAndConditions({setIsAccepted, closeTerms}) {

    const acceptTerms = () => {
        setIsAccepted(true);
        closeTerms();
    }

    const declineTerms = () => {
        setIsAccepted(false);
        closeTerms();
    }

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 bg-black/70`}>
            <div className="relative bg-[#d8d8d8] w-[90%] sm:w-[35rem] h-[65%] rounded-lg py-3 flex flex-col">
                <img onClick={closeTerms} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mt-3 sm:mt-0 mb-4'>Terms and Conditions</h1>

                <div className='h-full overflow-y-auto px-3 sm:px-5 border-t-[1px] border-b-[1px] border-text mx-4'>
                    <div className='px-2 sm:px-3 pb-7 pt-5'>
                        <p className='font-semibold pb-2'>1. Account Registration</p>
                        <ul className='list-disc pl-5'>
                            <li>Users must provide accurate and complete information when creating an account.</li>
                            <li>Only one account per user is allowed.</li>
                            <li>You are responsible for maintaining the security of your account credentials.</li>
                        </ul>
                    </div>

                    <div className='px-2 sm:px-3 pb-7'>
                        <p className='font-semibold pb-2'>2. User Responsibilities</p>
                        <ul className='list-disc pl-5'>
                            <li>Users must ensure that all pet adoption listings are truthful and comply with ethical adoption practices.</li>
                            <li>Any inappropriate, false, or misleading content will result in account suspension or removal.</li>
                            <li>Users must treat other members respectfully and avoid harassment or offensive behavior.</li>
                        </ul>
                    </div>

                    <div className='px-2 sm:px-3 pb-7'>
                        <p className='font-semibold pb-2'>3. Adoption Guidelines</p>
                        <ul className='list-disc pl-5'>
                            <li>HomePaws serves as a platform for connecting pet adopters with pet owners and shelters.</li>
                            <li>We do not guarantee successful adoptions and encourage responsible pet ownership.</li>
                            <li>Users should verify pet health, vaccination records, and other details before adopting.</li>
                        </ul>
                    </div>

                    <div className='px-2 sm:px-3 pb-7'>
                        <p className='font-semibold pb-2'>4. Content and Privacy</p>
                        <ul className='list-disc pl-5'>
                            <li>Users grant HomePaws the right to display content they upload, such as pet images and descriptions.</li>
                            <li>Personal information will be handled in accordance with our Privacy Policy.</li>
                        </ul>
                    </div>

                    <div className='px-2 sm:px-3 pb-7'>
                        <p className='font-semibold pb-2'>5. Prohibited Activities</p>
                        <ul className='list-disc pl-5'>
                            <li>Posting illegal, abusive, or fraudulent content.</li>
                            {/* <li>Selling pets for profit (HomePaws supports ethical rehoming only).</li> */}
                            <li>Using the platform for spam, scams, or misleading activities.</li>
                        </ul>
                    </div>

                    <div className='px-2 sm:px-3 pb-7'>
                        <p className='font-semibold pb-2'>6. Account Suspension & Termination</p>
                        <ul className='list-disc pl-5'>
                            <li>HomePaws reserves the right to suspend or terminate accounts that violate these terms.</li>
                            <li>Banned users may appeal their suspension by contacting support.</li>
                        </ul>
                    </div>

                    <div className='px-2 sm:px-3 pb-7'>
                        <p className='font-semibold pb-2'>7. Limitation of Liability</p>
                        <ul className='list-disc pl-5'>
                            <li>HomePaws is not responsible for disputes between users, including adoption issues.</li>
                            <li>We do not guarantee the accuracy of pet listings.</li>
                        </ul>
                    </div>

                </div>

                {/* POSTING COMMENT */}
                <div className='mt-3 sm:py-2 flex items-center justify-center gap-5 px-3 sm:px-5'>
                   <button onClick={acceptTerms} className='bg-[#80A933] hover:bg-[#74992f] duration-150 py-2 px-5 text-sm sm:text-base rounded-md font-medium text-white'>ACCEPT</button> 
                    <button onClick={declineTerms} className='bg-[#D25A5A] hover:bg-[#bb5151] duration-150 py-2 px-5 text-sm sm:text-base rounded-md font-medium text-white'>DECLINE</button>
                </div>
            </div>
        </div>
    )
}

export default TermsAndConditions