import React from 'react'
import contract from './assets/contract.svg'
import { jsPDF } from 'jspdf';

function AdoptionContract({data, pet}) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const adoptionContractTemplate = `
        ADOPTION CONTRACT

        This agreement is made on ${formatDate(data.meetupSchedule.meetUpDate)} by and between:

        Pet Owner: ${pet.ownerLastName}, ${pet.ownerFirstName} ${pet.ownerMI}, residing at ${pet.houseNo} ${pet.barangay} ${pet.municipality}, Cavite

        AND

        Adopter: ${data.adopterLastName}, ${data.adopterFirstName} ${data.adopterMI}, residing at ${data.houseNo} ${data.barangay} ${data.municipality}, Cavite

        regarding the adoption of the following pet:

        Pet Information:
        - Name: ${pet.petName}
        - Type: ${pet.petType}
        - Age: ${pet.age}
        - Color: ${pet.color}

        The parties hereby agree to the following terms and conditions:

        1. Transfer of Ownership:
        - The Pet Owner agrees to transfer ownership of the above-named pet to the Adopter on the date of signature.
        - The Adopter agrees to assume full responsibility for the pet upon signing this contract.

        2. Adopter's Responsibilities:
        - The Adopter agrees to provide the pet with adequate food, water, shelter, and veterinary care, including routine check-ups and vaccinations, as needed.
        - The Adopter will ensure the pet is provided with a safe and loving home.
        - The Adopter agrees not to use the pet for breeding purposes or to subject the pet to any form of cruelty or neglect.

        3. Health and Well-being:
        - The Pet Owner has disclosed any known medical conditions of the pet as follows: 
        - The Adopter agrees to seek immediate veterinary care if the pet shows any signs of illness or injury.
        - The Adopter agrees not to euthanize the pet unless it is in the best interest of the pet's health as advised by a licensed veterinarian.

        4. Return of Pet:
        - If, for any reason, the Adopter is unable to continue caring for the pet, the Pet Owner has the right to reclaim the pet without reimbursement.
        - The Adopter agrees to contact the Pet Owner immediately should they no longer be able to care for the pet and will not transfer ownership to another person without the consent of the Pet Owner.

        5. Follow-Up:
        - The Pet Owner may follow up with the Adopter within the first 6 months of adoption to ensure the pet is being properly cared for. This may include home visits or communication via phone/email.

        6. Indemnification:
        - The Adopter agrees to hold the Pet Owner harmless from any liability arising from the pet’s behavior after the adoption date, including damage to property or injury to persons or animals.

        Signatures:

        By signing this contract, both parties agree to the terms and conditions set forth above.

        Pet Owner: ___________________________   Date: ________________

        Adopter: ___________________________   Date: ________________

        Witness (Optional): ___________________________   Date: ________________

    `;

    const generateAdoptionContract = async () => {
        const contract = adoptionContractTemplate;
        return contract;
      };
      
      
      

    const generatePDF = async () => {
        const contractText = await generateAdoptionContract();
        const doc = new jsPDF();
    
        doc.setFontSize(11);
        const leftMargin = 20;
        const contentMargin = 30;
        const lineHeight = 6;
        const pageWidth = doc.internal.pageSize.width;
        let yPosition = 20;
    
        const lines = contractText.split('\n');
    
        lines.forEach(line => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
    
            if (line.match(/^\d+\./)) {
                // Numbered items
                doc.text(line, leftMargin, yPosition, { align: 'left' });
                yPosition += lineHeight;
            } else if (line.trim().startsWith('-')) {
                // Bulleted items
                const wrappedText = doc.splitTextToSize(line.trim(), pageWidth - contentMargin - leftMargin);
                wrappedText.forEach((textLine, index) => {
                    if (index === 0) {
                        doc.text(textLine, contentMargin, yPosition, { align: 'left' });
                    } else {
                        doc.text(textLine, contentMargin, yPosition, { align: 'justify', maxWidth: pageWidth - contentMargin - leftMargin });
                    }
                    yPosition += lineHeight;
                });
            } else {
                // Regular text
                const wrappedText = doc.splitTextToSize(line, pageWidth - 2 * leftMargin);
                wrappedText.forEach(textLine => {
                    doc.text(textLine, leftMargin, yPosition, { align: 'justify', maxWidth: pageWidth - 2 * leftMargin });
                    yPosition += lineHeight;
                });
            }
        });
    
        doc.save(`${pet.petName}_AdoptionContract.pdf`);
    };

    // console.log("DATA: ", data)
    // console.log("PET: ", pet)


    return (
        <button onClick={() => generatePDF()} className='flex bg-[#6AAAAA] cursor-pointer duration-150 hover:bg-[#619b9b] items-center text-xs md:text-base font-medium gap-2 text-white p-2 rounded-md'><img className='w-4 h-4' src={contract} alt="" />Adoption Contract</button>
    )
}

export default AdoptionContract