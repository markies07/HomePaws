import express from 'express';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import admin from 'firebase-admin';

const app = express();

app.use(express.json());

// Firebase Admin initialization (make sure to add your credentials file)
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://console.firebase.google.com/u/0/project/paws-ae1eb/overview"
});

const db = admin.firestore();

// Route for manually sending an email
app.post('/send-email', async (req, res) => {
  const { email, subject, text } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'markchristiannaval07@gmail.com', // Your email
        pass: 'lorenaflores123'   // Your email password
      }
    });

    const mailOptions = {
      from: 'markchristiannaval07@gmail.com',
      to: email,
      subject: subject,
      text: text
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent');
  } catch (error) {
    res.status(500).send('Error sending email: ' + error.toString());
  }
});

// Cron job that runs every day at midnight (00:00)
cron.schedule('0 * * * *', async () => {
  const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
  console.log('Cron job is running');
  try {
    // Fetch all accepted applications from Firestore
    const acceptedApplicationsSnapshot = await db.collection('acceptedApplications').get();
    
    acceptedApplicationsSnapshot.forEach(async (doc) => {
      const application = doc.data();

      // Check if the meet-up is scheduled for today
      if (application.meetupSchedule?.meetUpDate === today) {
        // Send email to the adopter
        await sendEmail(application.adopterEmail, `Meet-up Reminder`, `Your meet-up for ${application.petName} is scheduled for today.`);
        
        // Send email to the pet owner
        await sendEmail(application.petOwnerEmail, `Meet-up Reminder`, `You have a meet-up scheduled with ${application.adopterName} today for ${application.petName}.`);
      }
    });
  } catch (error) {
    console.error('Error checking meet-up schedule:', error);
  }
});

// Helper function to send an email using Nodemailer
async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'markchristiannaval07@gmail.com',
      pass: 'lorenaflores123',
    },
  });

  const mailOptions = {
    from: 'markchristiannaval07@gmail.com',
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
