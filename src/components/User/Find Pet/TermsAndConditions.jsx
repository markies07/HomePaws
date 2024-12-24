import React from 'react'
import close from '../../../assets/icons/close-dark.svg'

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
                        <p className='font-semibold pb-2'>1. Commitment to Care</p>
                        <ul className='list-disc pl-5'>
                            <li>I agree to provide adequate food, water, and shelter for the pet at all times.</li>
                            <li>I will ensure the pet receives regular veterinary checkups and vaccinations as needed.</li>
                            <li>I will provide a safe, loving, and healthy environment for the pet.</li>
                        </ul>
                    </div>

                    <div className='px-2 sm:px-3 pb-7'>
                        <p className='font-semibold pb-2'>2. No Transfer of Ownership</p>
                        <ul className='list-disc pl-5'>
                            <li>I agree that I will not sell, abandon, or transfer ownership of the pet without informing and seeking approval from the animal pound.</li>
                            <li>If I can no longer care for the pet, I will contact the animal pound for guidance.</li>
                        </ul>
                    </div>

                    <div className='px-2 sm:px-3 pb-7'>
                        <p className='font-semibold pb-2'>3. Responsibility for Costs</p>
                        <ul className='list-disc pl-5'>
                            <li>I understand that all costs related to the pet’s care, including food, grooming, medical treatment, and other expenses, are my responsibility.</li>
                        </ul>
                    </div>

                    <div className='px-2 sm:px-3 pb-7'>
                        <p className='font-semibold pb-2'>4. Spaying/Neutering (if applicable)</p>
                        <ul className='list-disc pl-5'>
                            <li>I will ensure the pet is spayed/neutered if it has not already been done and follow any provided instructions regarding this procedure.</li>
                        </ul>
                    </div>

                    <div className='px-2 sm:px-3 pb-7'>
                        <p className='font-semibold pb-2'>5. Commitment to Time and Attention</p>
                        <ul className='list-disc pl-5'>
                            <li>I will provide the necessary time, attention, and affection the pet requires for its well-being and mental health.</li>
                        </ul>
                    </div>

                    <div className='px-2 sm:px-3 pb-7'>
                        <p className='font-semibold pb-2'>6. Regular Updates</p>
                        <ul className='list-disc pl-5'>
                            <li>I understand that the animal pound or the previous pet owner may request updates on the pet’s well-being and living conditions.</li>
                        </ul>
                    </div>

                    <div className='px-2 sm:px-3 pb-7'>
                        <p className='font-semibold pb-2'>7. Right of Recovery</p>
                        <ul className='list-disc pl-5'>
                            <li>I acknowledge that the adoption agency has the right to reclaim the pet if it is determined that the terms and conditions are not being met or if the pet is being mistreated.</li>
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