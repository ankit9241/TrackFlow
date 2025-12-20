import { sendContactEmail } from '../utils/email.js';

// @desc    Send contact email
// @route   POST /api/contact
// @access  Public
export const contactUs = async (req, res, next) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        await sendContactEmail({ name, email, subject, message });
        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Email could not be sent' });
    }
};
