import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close-dark.svg'
import { AuthContext } from '../../General/AuthProvider'
import { db } from '../../../firebase/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { successAlert } from '../../General/CustomAlert';
import { notifyErrorOrange } from '../../General/CustomToast';
import paw from './assets/white-paw.svg'
import RehomedComplete from './RehomedComplete'
import MeetupMap from '../../General/MeetupMap';

function Schedule({closeUI, data, pet, adopter, isMeetup}) {
    const {user, userData} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [meetUpDate, setMeetUpDate] = useState('');
    const [meetUpTime, setMeetUpTime] = useState('');
    const [meetUpPlace, setMeetUpPlace] = useState('');
    const [selectedMunicipality, setSelectedMunicipality] = useState("");
    const [barangayList, setBarangayList] = useState([]);
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [venue, setVenue] = useState('');
    const [isScheduled, setIsScheduled] = useState(data.isScheduled);

    const municipalities = {
        "Alfonso": ["Amuyong", "Bilog", "Buck Estate", "Esperanza Ibaba", "Esperanza Ilaya", "Kaytitinga I", "Kaytitinga II", "Kaytitinga III", "Luksuhin", "Mangas I", "Mangas II", "Marahan I", "Marahan II", "Pajo", "Population", "Santa Teresa", "Sikat", "Sulsugin", "Taywanak Ibaba", "Taywanak Ilaya", "Upli"],
        
        "Amadeo": ["Banay-Banay", "Buho", "Halang", "Lalaan I", "Lalaan II", "Maymangga", "Minantok Kanluran", "Minantok Silangan", "Pangil", "Talon"],
        
        "Bacoor": ["Alima", "Aniban I", "Aniban II", "Aniban III", "Aniban IV", "Aniban V", "Banalo", "Bayanan", "Daang Bukid", "Digman", "Dulong Bayan", "Habay I", "Habay II", "Kaingin", "Ligas I", "Ligas II", "Ligas III", "Mabolo I", "Mabolo II", "Mabolo III", "Maliksi I", "Maliksi II", "Maliksi III", "Molino I", "Molino II", "Molino III", "Molino IV", "Molino V", "Molino VI", "Molino VII", "Niog I", "Niog II", "Niog III", "P.F. Espiritu I", "P.F. Espiritu II", "Queens Row Central", "Queens Row East", "Queens Row West", "Real I", "Real II", "Salinas I", "Salinas II", "Salinas III", "Salinas IV", "San Nicolas I", "San Nicolas II", "San Nicolas III", "Sineguelasan", "Talaba I", "Talaba II", "Talaba III", "Talaba IV", "Talaba V", "Talaba VI", "Talaba VII", "Zapote I", "Zapote II", "Zapote III", "Zapote IV", "Zapote V"],
        
        "Carmona": ["Bancal", "Barangay 1 (Poblacion)", "Barangay 2 (Poblacion)", "Barangay 3 (Poblacion)", "Barangay 4 (Poblacion)", "Barangay 5 (Poblacion)", "Barangay 6 (Poblacion)", "Barangay 7 (Poblacion)", "Barangay 8 (Poblacion)", "Cabilang Baybay", "Lantic", "Mabuhay", "Maduya", "Milagrosa"],
        
        "Cavite City": ["Caridad", "Dalahican", "San Antonio", "San Rafael", "Santa Cruz", "Santo Niño", "San Roque", "San Sebastian", "Pamplona I", "Pamplona II", "Pamplona III", "Sta. Elena", "Villa San Jose", "Paterno", "San Juan", "Tanza", "31 (Kabalutan)", "37 (Sampalukan)", "47 (Arsenal)", "48 (Villagas)", "50 (Luciano)", "54 (Maliksi)", "62-A (Kapanikian)", "62-B (Kalayaan)"],
        
        "Dasmariñas": ["Burol I", "Burol II", "Burol III", "Datu Esmael", "Langkaan I", "Langkaan II", "Paliparan I", "Paliparan II", "Paliparan III", "Sabang", "Salawag", "Salitran I", "Salitran II", "Salitran III", "Salitran IV", "Sampaloc I", "Sampaloc II", "Sampaloc III", "Sampaloc IV", "San Agustin I", "San Agustin II", "San Agustin III", "San Andres I", "San Andres II", "San Esteban", "San Jose", "San Lorenzo I", "San Lorenzo II", "San Luis I", "San Luis II", "San Miguel I", "San Miguel II", "San Simon", "Santa Cristina I", "Santa Cristina II", "Victoria Reyes", "Zone I", "Zone I-A", "Zone II", "Zone III", "Zone IV"],
        
        "General Mariano Alvarez": ["Aldiano-Namayan", "Benjamin Tirona", "Bernardo Pulido", "Epifanio Malia", "Francisco De Castro", "Gavino Maderan", "Inocencio Salud", "Jacinto Lumbreras", "Kapitan Kua", "Koronel Calderon", "Macario Dacon", "Nicolasa Virata", "Pantaleon Cruz", "Ramon Cruz", "San Gabriel", "San Jose", "Santo Niño"],
        
        "General Emilio Aguinaldo": ["Bendita I", "Bendita II", "Castaños I", "Castaños II", "Kabulusan", "Kaymisas", "Lumipa", "Narvaez I", "Narvaez II", "Tabora"],
        
        "General Trias": ["Alingaro", "Arnaldo", "Bacao I", "Bacao II", "Bagumbayan", "Buenavista I", "Buenavista II", "Buenavista III", "Corregidor", "Dulong Bayan", "Governor Ferrer", "Javalera", "Manggahan", "Navarro", "Panungyanan", "Pasong Camachile I", "Pasong Camachile II", "Pasong Kawayan I", "Pasong Kawayan II", "Pinagtipunan", "Prinza", "Progressive", "San Francisco", "San Juan I", "San Juan II", "Santiago", "Tapia", "Tejero"],
        
        "Imus": ["Alapan I-A", "Alapan I-B", "Alapan I-C", "Alapan II-A", "Alapan II-B", "Anabu I-A", "Anabu I-B", "Anabu I-C", "Anabu I-D", "Anabu I-E", "Anabu I-F", "Anabu I-G", "Anabu II-A", "Anabu II-B", "Anabu II-C", "Anabu II-D", "Anabu II-E", "Anabu II-F", "Bagong Silang", "Bayan Luma I", "Bayan Luma II", "Bayan Luma III", "Bayan Luma IV", "Bayan Luma V", "Bayan Luma VI", "Bayan Luma VII", "Bayan Luma VIII", "Bayan Luma IX", "Bucandala I", "Bucandala II", "Bucandala III", "Bucandala IV", "Bucandala V", "Magdalo", "Malagasang I-A", "Malagasang I-B", "Malagasang I-C", "Malagasang I-D", "Malagasang I-E", "Malagasang I-F", "Malagasang I-G", "Malagasang II-A", "Malagasang II-B", "Malagasang II-C", "Malagasang II-D", "Malagasang II-E", "Malagasang II-F", "Malagasang II-G", "Mariano Espeleta I", "Mariano Espeleta II", "Mariano Espeleta III", "Medicion I-A", "Medicion I-B", "Medicion I-C", "Medicion I-D", "Medicion II-A", "Medicion II-B", "Medicion II-C", "Medicion II-D", "Medicion II-E", "Medicion II-F", "Palico I", "Palico II", "Palico III", "Palico IV", "Pasong Buaya I", "Pasong Buaya II", "Pinagbuklod", "Poblacion I-A", "Poblacion I-B", "Poblacion I-C", "Poblacion II-A", "Poblacion II-B", "Poblacion III-A", "Poblacion III-B", "Poblacion IV-A", "Poblacion IV-B", "Poblacion IV-C", "Poblacion IV-D", "Tanzang Luma I", "Tanzang Luma II", "Tanzang Luma III", "Tanzang Luma IV", "Tanzang Luma V", "Tanzang Luma VI", "Toclong I-A", "Toclong I-B", "Toclong I-C", "Toclong II-A", "Toclong II-B"],
        
        "Indang": ["Agus-os", "Alulod", "Banaba Cerca", "Banaba Lejos", "Bancod", "Buna Cerca", "Buna Lejos", "Calumpang Cerca", "Calumpang Lejos", "Carasuchi", "Daine I", "Daine II", "Guyam Malaki", "Guyam Munti", "Harasan", "Kaytambog", "Kaytapos", "Limbon", "Lumampong Balagbag", "Lumampong Halayhay", "Mahabang Kahoy Cerca", "Mahabang Kahoy Lejos", "Mataas na Lupa", "Munting Tubig", "Pulo", "Tambo Kulit", "Tambo Malaki", "Tambo Munti", "Tuna"],
        
        "Kawit": ["Bagumbayan", "Binakayan", "Balsahan", "Congbalay", "Gahak", "Kaingen", "Magdalo", "Marulas", "Poblacion", "Putol", "San Sebastian", "Santa Isabel", "Tabon I", "Tabon II", "Tabon III", "Toclong", "Tramo", "Wakas"],
        
        "Magallanes": ["Barangay 1 (Poblacion)", "Barangay 2 (Poblacion)", "Barangay 3 (Poblacion)", "Barangay 4 (Poblacion)", "Barangay 5 (Poblacion)", "Barangay 6 (Poblacion)", "Barangay 7 (Poblacion)", "Barangay 8 (Poblacion)", "Caluangan", "Medina", "Pacheco", "Ramirez", "Talabaan", "Tambo"],
        
        "Maragondon": ["Bucal I", "Bucal II", "Bucal III-A", "Bucal III-B", "Bucal IV", "Bucal V", "Caingin", "Garita A", "Garita B", "Layong Mabilog", "Mabato", "Pantihan I", "Pantihan II", "Pantihan III", "Pantihan IV", "Pinagsanhan A", "Pinagsanhan B", "San Miguel A", "San Miguel B", "Santa Mercedes", "Talipusngo", "Tejero", "Tulay Silangan"],
        
        "Mendez": ["Anuling Cerca I", "Anuling Cerca II", "Anuling Lejos I", "Anuling Lejos II", "Arbosto", "Bukal", "Miguel Mojica", "Palocpoc I", "Palocpoc II", "Poblacion I", "Poblacion II", "Poblacion III", "Poblacion IV", "Panungyan I", "Panungyan II"],
        
        "Naic": ["Bagong Karsada", "Balsahan", "Bancaan", "Bucana Malaki", "Bucana Sasahan", "Calubcob", "Capt. C. Nazareno (Poblacion)", "Gomez-Zamora (Poblacion)", "Ibayo Estacion", "Ibayo Silangan", "Kanluran", "Labac", "Latoria", "Mabolo", "マニラーフィリピン (Poblacion)", "Munting Mapino", "Palangue I", "Palangue II", "Palangue III", "Sabang", "San Roque (Poblacion)", "Santulan", "Timalan Balsahan", "Timalan Concepcion", "Timalan Malainen", "Timalan Parada", "Timalan Tanza"],
        
        "Noveleta": ["Magdiwang", "Poblacion", "Poblacion Proper", "Salcedo I", "Salcedo II", "San Antonio I", "San Antonio II", "San Jose I", "San Jose II", "San Juan I", "San Juan II", "San Rafael I", "San Rafael II", "San Rafael III", "San Rafael IV", "Santa Rosa I", "Santa Rosa II"],
  
        "Rosario": ["Bagbag I", "Bagbag II", "Kanluran", "Ligtong I", "Ligtong II", "Ligtong III", "Ligtong IV", "Muzon I", "Muzon II", "Sapa I", "Sapa II", "Sapa III", "Sapa IV", "Silangan", "Tejeros Convention", "Wawa I", "Wawa II", "Wawa III"],
        
        "Silang": ["Adlas", "Balite I", "Balite II", "Balubad", "Batas", "Biluso", "Buho", "Bulihan", "Cabangis", "Carmen", "Putting Kahoy", "Iba", "Inchican", "Kaong", "Lalaan I", "Lalaan II", "Litlit", "Lucsuhin", "Lumil", "Maguyam", "Malabag", "Malaking Tatyao", "Munting Ilog", "Paligawan", "Pasong Langka", "Pooc I", "Pooc II", "Pulong Bunga", "Pulong Saging", "Sabutan", "San Miguel I", "San Miguel II", "San Vicente I", "San Vicente II", "Santa Rosa I", "Santa Rosa II", "Tartaria", "Tibig", "Tubuan I", "Tubuan II", "Tubuan III"],
        
        "Tagaytay": ["Asisan", "Bagong Tubig", "Calabuso", "Dapdap East", "Dapdap West", "Francisco", "Guinhawa North", "Guinhawa South", "Iruhin Central", "Iruhin East", "Iruhin South", "Iruhin West", "Kaybagal Central", "Kaybagal East", "Kaybagal North", "Kaybagal South", "Mag-Asawang Ilat", "Maharlika East", "Maharlika West", "Maitim II Central", "Maitim II East", "Maitim II West", "Mendez Crossing East", "Mendez Crossing West", "Neogan", "Patutong Malaki North", "Patutong Malaki South", "Sambong", "San Jose", "Silang Junction North", "Silang Junction South", "Sungay East", "Sungay West", "Tolentino East", "Tolentino West"],
        
        "Tanza": ["Amaya I", "Amaya II", "Amaya III", "Amaya IV", "Amaya V", "Amaya VI", "Amaya VII", "Bagtas", "Biga", "Bonifacio", "Bucal", "Bunga", "Calibuyo", "Capipisa", "Daang Amaya I", "Daang Amaya II", "Daang Amaya III", "Halayhay", "Julugan I", "Julugan II", "Julugan III", "Julugan IV", "Julugan V", "Julugan VI", "Julugan VII", "Julugan VIII", "Mulawin", "Paradahan I", "Paradahan II", "Poblacion I", "Poblacion II", "Poblacion III", "Poblacion IV", "Punta I", "Punta II", "Sahud Ulan", "Sanja Mayor", "Santol", "Tres Cruses"],
        
        "Ternate": ["Poblacion I (Barangay 1)", "Poblacion II (Barangay 2)", "Poblacion III (Barangay 3)", "Bucana", "Sapang I", "Sapang II", "San Jose", "San Juan I", "San Juan II", "Poblacion I A", "Poblacion I B"],
        
        "Trece Martires": ["Aguado", "Cabezas", "Cabuco", "De Ocampo", "Hugo Perez", "Inocencio", "Lapidario", "Laqui", "Luciano", "Osorio", "Perez", "San Agustin", "Gregorio"]
    };

    useEffect(() => {
        if (data && data.meetupSchedule) {
          setMeetUpDate(data.meetupSchedule.meetUpDate || '');
          setMeetUpTime(data.meetupSchedule.meetUpTime || '');
          setMeetUpPlace(data.meetupSchedule.meetUpPlace || '');
        }
      }, [data]);

    const handleMunicipalityChange = (e) => {
        const municipality = e.target.value;
        setSelectedMunicipality(municipality);
        setBarangayList(municipalities[municipality] || []);
        setSelectedBarangay(""); // Reset barangay selection
    };

    // CHANGING FORMAT OF TIME
    function convertTo12Hour(time) {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        return `${hours}:${minutes} ${ampm}`;
    }

    // CHANGING FORMAT OF DATE
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const submitSchedule = async () => {
        setLoading(true);

        if (!meetUpDate || !meetUpTime || !selectedMunicipality || !selectedBarangay || !venue) {
            notifyErrorOrange("Please fill out all fields");
            setLoading(false);
            return;
        }

        try{
            const applicationRef = doc(db, 'acceptedApplications', data.applicationID);
            
            const meetUpData = {
                meetupSchedule: {
                    meetUpDate,
                    meetUpTime,
                    meetUpPlace: venue + " " + selectedBarangay + ", " + selectedMunicipality,
                    barangay: selectedBarangay,
                    municipality: selectedMunicipality
                },
                status: 'scheduled',
                isScheduled: true,
            }

            // NOTIFICATION
            const notificationRef = collection(db, 'notifications');
            await addDoc(notificationRef, {
                content: `submitted your meet up schedule with ${data.petName}.`,
                applicationID: data.applicationID,
                type: 'adoption',
                image: userData.profilePictureURL,
                senderName: userData.fullName,
                senderId: user.uid,
                userId: data.adopterUserID,
                isRead: false,
                accepted: true,
                timestamp: serverTimestamp(),
            });
    
            await updateDoc(applicationRef, meetUpData);
            successAlert('Meet-up schedule submitted successfully!');
            setTimeout(() => {
                window.location.reload();
            }, [1000])
            
        }
        catch(error){
            console.error(error);
            notifyErrorOrange("Failed to submit meet-up schedule. Please try again.");
        }
        finally{
            setLoading(false);
        }
    }

    const submitReschedule = async () => {
        setLoading(true);

        try{
            const docRef = doc(db, 'acceptedApplications', data.applicationID);

            await updateDoc(docRef, {
                "meetupSchedule.meetUpDate": meetUpDate,
                "meetupSchedule.meetUpTime": meetUpTime,
                "meetupSchedule.meetUpPlace": venue + " " + selectedBarangay + ", " + selectedMunicipality,
                "meetupSchedule.barangay": selectedBarangay,
                "meetupSchedule.municipality": selectedMunicipality,
                status: 'scheduled',
            })
            successAlert('New schedule submitted successfully!');
            setTimeout(() => {
                window.location.reload();
            }, [1000])
        }
        catch(error){
            console.error(error);
        }
        finally{
            setLoading(false);
        }
    }

    

    return (
        <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/65'>
            <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[30rem] h-auto rounded-lg py-5 flex flex-col">
                <img onClick={closeUI} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 sm:pt-0 mb-4'>Meet up Schedule</h1>
                
                {/* SETTING UP SCHEDULE */}
                {data.isScheduled === false && data.petOwnerID === user.uid && (
                    <div className='mt-3'>
                        <div className='w-full flex gap-2'>
                            <div className='w-[50%]'>
                                <p className='font-semibold'>Date</p>
                                <input required min={new Date(new Date().setDate(new Date().getDate())).toISOString().split("T")[0]} onChange={(e) => setMeetUpDate(e.target.value)} className='py-[3px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="date" />
                            </div>
                            <div className='w-[50%]'>
                                <p className='font-semibold'>Time</p>
                                <input required onChange={(e) => setMeetUpTime(e.target.value)} className='py-[3px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="time" />
                            </div>
                        </div>

                        {/* Municipality Dropdown */}
                        <label className="block mt-3">
                            <span className="font-semibold">Municipality</span>
                            <select
                            value={selectedMunicipality}
                            onChange={handleMunicipalityChange}
                            className='py-[4px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md'
                            >
                            <option value="">Select Municipality</option>
                            {Object.keys(municipalities).map((municipality) => (
                                <option key={municipality} value={municipality}>
                                {municipality}
                                </option>
                            ))}
                            </select>
                        </label>

                        {/* Barangay Dropdown */}
                        <label className="block mt-3">
                            <span className="font-semibold">Barangay</span>
                            <select
                            value={selectedBarangay}
                            onChange={(e) => setSelectedBarangay(e.target.value)}
                            className='py-[4px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md'
                            disabled={!selectedMunicipality}
                            >
                            <option value="">Select Barangay</option>
                            {barangayList.map((barangay) => (
                                <option key={barangay} value={barangay}>
                                {barangay}
                                </option>
                            ))}
                            </select>
                        </label>

                        <div className='w-full mt-3'>
                            <p className='font-semibold'>Venue</p>
                            <textarea required onChange={(e) => setVenue(e.target.value)} className='py-1 w-full h-16 px-2 outline-none border-2 border-text rounded-md' placeholder='Enter venue'></textarea>
                        </div>


                        {/* SUBMIT BUTTON */}
                        <div className='flex justify-center gap-2 pt-7'>
                            <button onClick={submitSchedule} className='bg-[#90b845] hover:bg-[#98c24a] cursor-pointer duration-150 font-medium gap-2 text-white py-1 px-5 rounded-md'>{loading ? 'SUBMITTING...' : 'SUBMIT'}</button>
                        </div>
                    </div>
                )}

                {/* FOR ADOPTER */}
                { data.isScheduled === false && data.adopterUserID === user.uid && (
                    <div className='w-full mt-3 bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                        <p className='font-semibold text-center leading-5'>Waiting for the pet owner to set up a schedule</p>
                    </div>
                )}

                {/* SUBMITTED SCHEDULE */}
                {data.isScheduled === true && isScheduled === true && (
                    <div className='mt-2'>

                        <div className='flex gap-2'>
                            <div className='w-[65%] bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                                <p className='font-semibold'>Date:</p>
                                <p>{formatDate(data.meetupSchedule.meetUpDate)}</p>
                            </div>
                            <div className='w-[35%] bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                                <p className='font-semibold'>Time:</p>
                                <p>{convertTo12Hour(data.meetupSchedule.meetUpTime)}</p>
                            </div>
                        </div>
                        <div className='w-full mt-2 bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                            <p className='font-semibold'>Place:</p>
                            <p>{data.meetupSchedule.meetUpPlace}</p>
                        </div>

                        {/* MEET UP MAP */}
                        <div className='w-full mt-2 h-52 bg-secondary p-1 shadow-custom rounded-md'>
                            <MeetupMap 
                                municipality={data.meetupSchedule.municipality} 
                                barangay={data.meetupSchedule.barangay} 
                            />
                        </div>

                        {/* BUTTONS */}
                        <div className='flex justify-center gap-2 pt-7'>
                            <button onClick={() => setIsScheduled(false)} className={`${data.status !== 'meetup' ? 'block' : 'hidden'} bg-[#D25A5A] hover:bg-[#c25454] cursor-pointer duration-150  font-medium gap-2 text-white py-1 px-4 rounded-md`}>RESCHEDULE</button>
                            <RehomedComplete isMeetup={isMeetup} adopter={adopter} data={data} pet={pet} />
                        </div>
                       
                    </div>
                )}

                {/* RESCHEDULING MEET-UP */}
                {isScheduled === false && data.meetupSchedule && (
                    <div className='mt-3'>
                        <div className='w-full flex gap-2'>
                            <div className='w-[50%]'>
                                <p className='font-semibold'>Date</p>
                                <input required min={new Date(new Date().setDate(new Date().getDate())).toISOString().split("T")[0]} onChange={(e) => setMeetUpDate(e.target.value)} value={meetUpDate} className='py-[3px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="date" />
                            </div>
                            <div className='w-[50%]'>
                                <p className='font-semibold'>Time</p>
                                <input required onChange={(e) => setMeetUpTime(e.target.value)} value={meetUpTime} className='py-[3px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="time" />
                            </div>
                        </div>
                        
                        {/* Municipality Dropdown */}
                        <label className="block mt-3">
                            <span className="font-semibold">Municipality</span>
                            <select
                            value={selectedMunicipality}
                            onChange={handleMunicipalityChange}
                            className='py-[4px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md'
                            >
                            <option value="">Select Municipality</option>
                            {Object.keys(municipalities).map((municipality) => (
                                <option key={municipality} value={municipality}>
                                {municipality}
                                </option>
                            ))}
                            </select>
                        </label>

                        {/* Barangay Dropdown */}
                        <label className="block mt-3">
                            <span className="font-semibold">Barangay</span>
                            <select
                            value={selectedBarangay}
                            onChange={(e) => setSelectedBarangay(e.target.value)}
                            className='py-[4px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md'
                            disabled={!selectedMunicipality}
                            >
                            <option value="">Select Barangay</option>
                            {barangayList.map((barangay) => (
                                <option key={barangay} value={barangay}>
                                {barangay}
                                </option>
                            ))}
                            </select>
                        </label>

                        <div className='w-full mt-3'>
                            <p className='font-semibold'>Venue</p>
                            <textarea required onChange={(e) => setVenue(e.target.value)} className='py-1 w-full h-16 px-2 outline-none border-2 border-text rounded-md' placeholder='Enter venue'></textarea>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className='flex justify-center gap-2 pt-7'>
                            <button onClick={submitReschedule} className='bg-[#90b845] hover:bg-[#98c24a] cursor-pointer duration-150 font-medium gap-2 text-white py-1 px-5 rounded-md'>{loading ? 'SUBMITTING...' : 'SUBMIT'}</button>
                            <button onClick={() => setIsScheduled(true)} className='bg-[#D25A5A] hover:bg-[#c25454] cursor-pointer duration-150 font-medium gap-2 text-white py-1 px-5 rounded-md'>CANCEL</button>
                        </div>
                    </div>
                )}

                
            </div>
        </div>
    )
}

export default Schedule