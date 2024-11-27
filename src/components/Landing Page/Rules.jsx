import React from 'react'
import close from './assets/close.svg'

function Rules({closeRules}) {
    return (
        <div className='fixed z-10 right-0 top-0 px-5 py-5 sm:px-10 sm:py-10 bg-secondary min-h-screen max-h-screen overflow-auto w-full flex flex-col text-text font-poppins'>
            <div className='absolute top-4 right-4 border-2 border-secondary hover:border-primary cursor-pointer p-1 duration-150'>
                <img onClick={closeRules} src={close} alt="" />
            </div>

            <p className='text-3xl font-medium mt-10 sm:mt-0 text-center sm:text-start'>Rules and Regulations</p>

            {/* QUESTIONS */}
            <div className='mt-10'>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>Respectful Communication</p>
                    <p>All users are required to communicate respectfully and professionally. Harassment, threats, or abusive language will not be tolerated and may result in account suspension.</p>
                </div>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>Accurate Information</p>
                    <p>Users must provide accurate and truthful information in their profiles, adoption posts, and applications. Misleading or false information can lead to penalties or account suspension.</p>
                </div>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>No Unauthorized Sales</p>
                    <p>The platform strictly prohibits the sale of pets for profit. Only adoption listings are allowed. Users found engaging in unauthorized sales will be penalized.</p>
                </div>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>Prohibited Content</p>
                    <p>Users must not post content that is offensive, explicit, or violates local laws. This includes photos, descriptions, or comments.</p>
                </div>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>Reporting Misconduct</p>
                    <p>Yes, if your account is deactivated, you can submit a reactivation request. Ensure that you’ve resolved any issues that may have led to the deactivation.</p>
                </div>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>Violations and Penalties</p>
                    <p>Violations of these rules may result in warnings, temporary suspensions, or permanent account deactivation depending on the severity of the offense.</p>
                </div>
                <div className='pb-7'>
                    <p className='font-semibold text-lg'>Account Security</p>
                    <p>Users are responsible for maintaining the security of their accounts. Sharing account credentials or engaging in unauthorized activities will result in penalties.</p>
                </div>
            </div>

        </div>
    )
}

export default Rules