import { handleApiError } from './utils';

export const sendEmail = async (emailData) => {
    console.warn("sendEmail is using a mock implementation.");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { patientEmail, subject, body } = emailData;
    if (!patientEmail || !subject || !body) {
        return handleApiError({ message: "Missing required fields for sending email." }, 'sendEmail', true);
    }
    
    console.log(`[Mock Email Sent]
    To: ${patientEmail}
    Subject: ${subject}
    Body: ${body.substring(0, 100)}...`);
    
    return { success: true, data: { message: "Email sent successfully (mocked)." } };
};

export const sendMessage = async (messageData) => {
    console.warn("sendMessage is using a mock implementation.");
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[Mock SMS Sent] To Patient ID ${messageData.patientId}: ${messageData.body}`);
    return { success: true };
};

export const sendNewsletter = async (post) => {
    console.warn("sendNewsletter is using a mock implementation.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`[Mock Newsletter Sent] For post: "${post.title}"`);
    return { success: true, data: { message: `Newsletter for "${post.title}" sent successfully (mocked).` } };
};