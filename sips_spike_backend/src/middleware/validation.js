import { body, query } from 'express-validator';
import mongoose from 'mongoose';
import { HtmlValidate } from "html-validate";
const htmlvalidate = new HtmlValidate();


export const validateUserSignUp = [
    body('name')
        .notEmpty().withMessage('Name is required.')
        .isString().withMessage('Name must be a string.')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Name cannot contain numbers or special characters.')
        .trim(),


    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),

    body('password')
        .notEmpty().withMessage('Password is required.')
        .isString().withMessage('Password must be a string.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
        .withMessage('Password must include upper/lowercase letters, a number, and a special character.'),


    body('role')
        .optional()
        .isIn(['parent', 'coach', 'admin']).withMessage('Please send a valid role: parent, coach'),
];
export const validateOtpVerify = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    // Validate 'otp'
    body('otp')
        .notEmpty().withMessage('OTP is required')
        .isNumeric().withMessage('OTP must be a number')
];
export const validateUserSignIn = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),

    body('password')
        .notEmpty().withMessage('Password is required')
    // .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];
export const validateChild = [
    body('firstName')
        .notEmpty().withMessage('First Name is required.')
        .isString().withMessage('First Name must be a string.')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('First Name cannot contain numbers or special characters.')
        .trim(),

    body('lastName')
        .optional()
        .trim()
        .isString().withMessage('Last name must be a string.')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Last Name cannot contain numbers or special characters.')
        .trim(),

    body('age')
        // .notEmpty().withMessage('Age is required.')
        .isInt({ min: 0 }).withMessage('Age must be a non-negative integer.'),

    body('level')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced'])
        .withMessage('Level must be one of: beginner, intermediate, advanced.'),

    body('emergencyContact')
        .optional()
        .trim()
        .matches(/^\+?[\d\s]+$/)
        .withMessage('Emergency contact must contain only numbers, spaces, and may start with +.')
        .custom(value => {
            // Remove '+' and spaces for digit length check
            const digitsOnly = value.replace(/\s+/g, '').replace(/^\+/, '');
            if (digitsOnly.length < 9 || digitsOnly.length > 15) {
                throw new Error('Emergency contact must be between 9 to 15 digits.');
            }
            return true;
        }),


    body('medicalNotes')
        .optional()
        .trim()
        .isString().withMessage('Medical notes must be a string.'),
];
export const validateSession = [
    body('sessionType')
        .notEmpty().withMessage('Session type is required.')
        .isIn(['group session', '1-on-1 training']).withMessage('Session type must be either "group session" or "1-on-1 training".'),
    body('childId')
        .notEmpty().withMessage('Child ID is required.')
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid Child ID.");
            }
            return true;
        }),

    body('coachId')
        .notEmpty().withMessage('Coach ID is required.')
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid Coach ID.");
            }
            return true;
        }),

    body('location')
        .notEmpty().withMessage('Location is required.')
        .isString().withMessage('Location must be a string.')
        .trim(),

    // body('timeOfDay')
    //     .notEmpty().withMessage('Time of day is required.')
    //     .matches(/^([01]\d|2[0-3]):00$/)
    //     .withMessage('Time of day must be in HH:00 format between 00:00 and 23:00.'),


    // body('ageRange')
    //     .notEmpty().withMessage('Age range is required.')
    //     .isIn(['All ages', '4-8', '6-10', '8-12', '10+']).withMessage('Age range must be one of: All ages, 4-8, 6-10, 8-12, 10+.'),

    body('scheduledDate')
        .notEmpty().withMessage('Scheduled date is required.')
        .isISO8601().withMessage('Scheduled date must be a valid date in the format YYYY-MM-DD.'),
];
export const validateAcceptRejectSession = [
    body('sessionId')
        .notEmpty().withMessage('Session ID is required.')
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid Session ID.");
            }
            return true;
        }),

    body('status')
        .notEmpty().withMessage('Status is required.')
        .isIn(['rejected', 'accepted']).withMessage('Status must be either "rejected" or "accepted".'),
];
export const validateResendOtp = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
];
export const validateFaq = [
    // body('childId')
    //     .notEmpty().withMessage('Child ID is required.')
    //     .custom(value => {
    //         if (!mongoose.Types.ObjectId.isValid(value)) {
    //             throw new Error("Invalid Child ID.");
    //         }
    //         return true;
    //     }),
    body('question')
        .notEmpty().withMessage('Question is required.')
        .isString().withMessage('Question must be a string.')
        .trim()
];
export const validateCreateTimeSlot = [
    body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array.'),

    body('*.scheduledDate')
        .notEmpty().withMessage('Scheduled date is required.')
        .isISO8601().withMessage('Scheduled date must be a valid date in the format YYYY-MM-DD.'),

    body('*.timeSlots')
        .isArray({ min: 1 }).withMessage('timeSlots must be a non-empty array.'),

    body('*.timeSlots.*.startTime')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('startTime must be in HH:MM format (00:00 to 23:59).'),

    body('*.timeSlots.*.endTime')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('endTime must be in HH:MM format (00:00 to 23:59).'),

];
export const validateGetAllSlots = [
    query('fromDate')
        .optional()
        .isISO8601().withMessage('from date must be a valid date in the format YYYY-MM-DD.'),
    query('toDate')
        .optional()
        .isISO8601().withMessage('to date must be a valid date in the format YYYY-MM-DD.'),
];
export const validUpadateSlotBYCoach = [
    query('slotId')
        .notEmpty().withMessage('Slot ID is required.')
        .isMongoId().withMessage('Slot ID must be a valid MongoDB ObjectId.'),
    body('startTime')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('startTime must be in HH:MM format (00:00 to 23:59).'),
    body('endTime')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('endTime must be in HH:MM format (00:00 to 23:59).'),
    body('scheduledDate')
        .optional()
        .notEmpty().withMessage('Scheduled date is required.')
        .isISO8601().withMessage('Scheduled date must be a valid date in the format YYYY-MM-DD.'),
    body('status')
        .optional()
        .isIn(['available', 'booked'])
        .withMessage('Status must be either "available" or "booked".'),
];
export const validDeleteSlotBySlotId = [
    query('slotId')
        .notEmpty().withMessage('Slot ID is required.')
        .isMongoId().withMessage('Slot ID must be a valid MongoDB ObjectId.')
];
export const validateRating = [
    query('childId')
        .notEmpty().withMessage('Child ID is required.')
        .isMongoId().withMessage('Child Id must be a valid MongoDB ObjectId.'),
    body('rating')
        .notEmpty().withMessage('Rating is required.')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be a number between 1 and 5.'),
    body('description')
        .optional()
        .isLength({ max: 300 }).withMessage('Description cannot exceed 300 characters.')
        .custom(value => {
            const wordCount = value.trim().split(/\s+/).length;
            if (wordCount < 5) {
                throw new Error('Description must be at least 5 words.');
            }
            return true;
        }),
];
export const validateAdminOverview = [
    query('sessionStatus')
        .optional()
        .isIn(['pending', 'accepted', 'rejected'])
        .withMessage('Session status must be one of: pending, accepted, rejected.'),
    query('coachId')
        .optional()
        .isMongoId().withMessage('Coach ID must be a valid MongoDB ObjectId.'),
];
export const validateEmailTempelate = [
    body('emailType')
        .notEmpty().withMessage('emailType is required.')
        .isIn(['all', 'coaches', 'parents', 'specific'])
        .withMessage('Email type must be one of: all, coaches, parents, specific.'),
    body('email')
        .if(body('emailType').equals('specific'))
        .notEmpty().withMessage('Email is required for specific emailType')
        .isEmail().withMessage('Please provide a valid email'),

    body('subject')
        .notEmpty().withMessage('Subject is required'),

    body('message')
        .notEmpty().withMessage('Message is required')
];
export const validateAddprompt = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required.'),

    body('prompt')
        .trim()
        .notEmpty()
        .withMessage('Prompt is required.'),
];
export const validateGetPromptById = [
    query('promptId')
        .notEmpty()
        .withMessage('Prompt Id is required.')
        .isMongoId().withMessage('Prompt Id must be a valid MongoDB ObjectId.'),
];
export const validateAddParentReview = [
    body('sessionId')
        .notEmpty()
        .withMessage('Session Id is required.')
        .isMongoId().withMessage('Session Id must be a valid MongoDB ObjectId.'),
    body('review')
        .custom(value => {
            if (!value || !value.trim()) {
                throw new Error('Review is required.');
            }
            return true;
        })
];
export const validateQuestionAnswer = [
    body('question')
        .notEmpty()
        .withMessage('Question is required.'),
    body('answer')
        .notEmpty()
        .withMessage('Answer is required.')
];
export const validateGetQuestionAnswerById = [
    query('questionId')
        .notEmpty()
        .withMessage('Question Id is required.')
        .isMongoId().withMessage('Question Id must be a valid MongoDB ObjectId.')
];
export const validateUpdateQuestionAnswerById = [
    query('questionId')
        .notEmpty()
        .withMessage('Question Id is required.')
        .isMongoId().withMessage('Question Id must be a valid MongoDB ObjectId.'),
    body('question')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Question cannot be empty or only spaces.'),
    body('answer')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Answer cannot be empty or only spaces.')
];
export const validateGetAllReviews = [
    query('coachId')
        .notEmpty()
        .withMessage('Coach Id is required.')
        .isMongoId().withMessage('Coach Id must be a valid MongoDB ObjectId.')
];
export const validateAddVariable = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required.'),
    body('value')
        .trim()
        .notEmpty()
        .withMessage('Value is required.')
];
export const validateGetVariableById = [
    query('variableId')
        .notEmpty()
        .withMessage('Variable Id is required.')
        .isMongoId().withMessage('Variable Id must be a valid MongoDB ObjectId.')
];
export const validateUpdateTempelateById = [
    query("tempelateId")
        .notEmpty()
        .withMessage("Template Id is required.")
        .isMongoId()
        .withMessage("Template Id must be a valid MongoDB ObjectId."),
    body("content")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Content cannot be empty."),

    //   .bail()
    //   .custom(value => {
    //     if (typeof value !== "string") throw new Error("Content must be a string.");
    //     const report = htmlvalidate.validateString(value);
    //     if (!report.valid) {
    //       let message = "Invalid HTML content.";
    //       if (report.results?.[0]?.messages?.length > 0) {
    //         message = report.results[0].messages[0].message;
    //       }
    //       throw new Error(message);
    //     }
    //     return true;
    //   }),
]
export const validateUpdateWebsiteLookbyId = [
    query('websiteLookId')
        .notEmpty()
        .withMessage('Website look Id is required.')
        .isMongoId().withMessage('Website look Id must be a valid MongoDB ObjectId.'),
    body('themeColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Theme color cannot be empty.'),

    body('buttonColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Button color cannot be empty.'),

    body('headerColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Header color cannot be empty.'),

    body('footerColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Footer color cannot be empty.'),

    body('cardColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Card color cannot be empty.'),
    body('sectionColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Section color cannot be empty.'),
    body('primaryColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Primary color cannot be empty.'),
    body('secondaryColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Secondary color cannot be empty.'),
    body('allCardColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('All Card color cannot be empty.'),
    body('textColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Text color cannot be empty.'),
    body('tableColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Table color cannot be empty.'),
    body('smallCard')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Small card cannot be empty.'),
    body('tableHeader')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Table header cannot be empty.'),
    body('cardNavbar')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Card Navbar cannot be empty.'),
    body("logo")
        .custom((value, { req }) => {
            // Case 1: File upload
            if (req.file) return true;

            // Case 2: Field not provided at all
            if (typeof value === "undefined") return true;

            // Case 3: String provided but empty/spaces
            if (typeof value === "string" && value.trim() === "") {
                throw new Error("Logo cannot be empty or spaces.");
            }

            return true;
        }),
    body('STRIPE_SECRET_KEY')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Stripe Key cannot be empty.'),
    body('STRIPE_WEBHOOK_SECRET')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Stripe Webhook Secret cannot be empty.'),
    body('LIVE_DOMAIN')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Live Domain cannot be empty.'),
    body('OPENAI_API_KEY')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Open Api Key cannot be empty.'),
    body('AWS_REGION')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Aws Region cannot be empty.'),
    body('AWS_ACCESS_KEY_ID')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Aws Access Key Id cannot be empty.'),
    body('AWS_SECRET_ACCESS_KEY')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Aws Secret Access Key cannot be empty.'),
    body('AWS_BUCKET_NAME')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Aws Bucket Name cannot be empty.'),
    body('EMAIL_USER')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Email User cannot be empty.'),
    body('EMAIL_PASS')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Email Password cannot be empty.'),
    body('ADMIN_PASS')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Admin Password cannot be empty.'),

];
export const validateWesiteLook = [
    body('themeColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Theme color cannot be empty.'),
    body('buttonColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Button color cannot be empty.'),
    body('headerColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Header color cannot be empty.'),
    body('footerColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Footer color cannot be empty.'),

    body('cardColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Card color cannot be empty.'),
    body('sectionColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Section color cannot be empty.'),
    body('primaryColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Primary color cannot be empty.'),
    body('secondaryColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Secondary color cannot be empty.'),
    body('allCardColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('All Card color cannot be empty.'),
    body('textColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Text color cannot be empty.'),
    body('tableColor')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Table color cannot be empty.'),
    body('smallCard')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Small cards cannot be empty.'),
    body('tableHeader')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Table header cannot be empty.'),
    body('cardNavbar')
        .trim()
        .notEmpty()
        .withMessage('Card navbar cannot be empty.'),
];
export const aiReportVAlidation = [
    query("coachId")
        .notEmpty()
        .withMessage("Coach Id is required.")
        .isMongoId()
        .withMessage("Coach Id must be a valid MongoDB ObjectId.")
]
export const coachReportValidate = [
    query('fromDate')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('From date cannot be empty.')
        .isISO8601().withMessage('From date must be a valid date in the format YYYY-MM-DD.'),
    query('toDate')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('To date cannot be empty.')
        .isISO8601().withMessage('To date must be a valid date in the format YYYY-MM-DD.'),
]
export const validateCancelPayment = [
    body("sessionId")
        .notEmpty()
        .withMessage("Session Id is required.")
        .isMongoId()
        .withMessage("Session Id must be a valid MongoDB ObjectId."),
    body('note')
        .trim()
        .notEmpty().withMessage('Note cannot be empty.')
    // .custom((value) => {
    //     const wordCount = value.split(/\s+/).filter(word => word.length > 0).length;
    //     if (wordCount < 10) {
    //         throw new Error('Note must be at least 10 words long.');
    //     }
    //     return true;
    // }),
]
export const validateRefundPAymentByCoach = [
    body("sessionId")
        .notEmpty()
        .withMessage("Session Id is required.")
        .isMongoId()
        .withMessage("Session Id must be a valid MongoDB ObjectId."),
    body("parentId")
        .notEmpty()
        .withMessage("Parent Id is required.")
        .isMongoId()
        .withMessage("Parent Id must be a valid MongoDB ObjectId."),
    body("amount")
        .notEmpty()
        .withMessage("Amount is required.")
];
export const validateCancelSession = [
    body("sessionId")
        .notEmpty()
        .withMessage("Session Id is required.")
        .isMongoId()
        .withMessage("Session Id must be a valid MongoDB ObjectId."),
    body('reason')
        .trim()
        .notEmpty().withMessage('Reason cannot be empty.')
        .isLength({ min: 10 }).withMessage('Reason must be at least 10 characters long.'),
];
export const validateSessionsOfParent = [
    query('fromDate')
        .optional()
        .isISO8601().withMessage('from date must be a valid date in the format YYYY-MM-DD.'),
    query('toDate')
        .optional()
        .isISO8601().withMessage('to date must be a valid date in the format YYYY-MM-DD.'),
    query('status')
        .trim()
        .optional()
        .notEmpty().withMessage('Status cannot be empty.')
        .isIn(['cancel', 'accepted', 'pending', 'rejected']).withMessage('Status type must be either "cancel","accepted","pending" or rejected.'),
];
export const validateRefundRequestAcceptReject = [
    body("requestId")
        .notEmpty()
        .withMessage("Request Id is required.")
        .isMongoId()
        .withMessage("Session Id must be a valid MongoDB ObjectId."),
    body('requestStatus')
        .trim()
        .optional()
        .notEmpty().withMessage('Request status cannot be empty.')
        .isIn(['accept', 'reject']).withMessage('Status type must be either "accept" or reject.'),
];
export const transactionValidation = [
    query('status')
        .trim()
        .optional()
        .notEmpty().withMessage('Request status cannot be empty.')
        .isIn(['refund', 'complete']).withMessage('Status type must be either refund or complete.'),
];
export const validateRefundRequest = [
    query('status')
        .trim()
        .optional()
        .notEmpty().withMessage('Request status cannot be empty.')
        .isIn(['reject']).withMessage('Status type must be reject.'),
];
export const forgotPasswordValidate = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
];
export const resetPasswordValidation = [
    body('token')
        .notEmpty().withMessage('Token is required'),
    body('newPassword')
        .notEmpty().withMessage('Password is required.')
        .isString().withMessage('Password must be a string.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
        .withMessage('Password must include upper/lowercase letters, a number, and a special character.'),
];
export const validClientsOfCoach = [
    query('status')
        .trim()
        .optional()
        .notEmpty().withMessage('Request status cannot be empty.')
        .isIn(['pending', 'accepted', 'rejected']).withMessage('Status type must be rejected,pending or accepted.'),
];
export const validateEditChild = [
    query("childId")
        .notEmpty()
        .withMessage("Child Id is required.")
        .isMongoId()
        .withMessage("Child Id must be a valid MongoDB ObjectId."),
    body('firstName')
        .optional()
        .notEmpty().withMessage('First Name cannot be empty if provided.')
        .isString().withMessage('First Name must be a string.')
        .matches(/^[A-Za-z\s]+$/).withMessage('First Name cannot contain numbers or special characters.')
        .trim(),

    body('lastName')
        .optional({ checkFalsy: true }) // ✅ makes empty strings and null undefined
        .isString().withMessage('Last Name must be a string.')
        .matches(/^[A-Za-z\s]+$/).withMessage('Last Name can only contain letters and spaces.')
        .trim(),



    body('age')
        .optional()
        .isInt({ min: 4, max: 100 })
        .withMessage('Age must be an integer between 4 and 100.'),


    body('level')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced'])
        .withMessage('Level must be one of: beginner, intermediate, advanced.'),

    body('emergencyContact')
        .optional()
        .trim()
        .matches(/^\+?[\d\s]+$/)
        .withMessage('Emergency contact must contain only numbers, spaces, and may start with +.')
        .custom(value => {
            // Remove '+' and spaces for digit length check
            const digitsOnly = value.replace(/\s+/g, '').replace(/^\+/, '');
            if (digitsOnly.length < 9 || digitsOnly.length > 15) {
                throw new Error('Emergency contact must be between 9 to 15 digits.');
            }
            return true;
        }),
    body('medicalNotes')
        .optional()
        .trim()
        .isString().withMessage('Medical notes must be a string.'),
];
export const validateDeleteChild = [
    query("childId")
        .notEmpty()
        .withMessage("Child Id is required.")
        .isMongoId()
        .withMessage("Child Id must be a valid MongoDB ObjectId."),
];
export const validateGroupSession = [
    body('location')
        .notEmpty().withMessage('Location is required.')
        .isString().withMessage('Location must be a string.')
        .trim(),
    body('title')
        .notEmpty().withMessage('Title is required.')
        .isString().withMessage('Title must be a string.')
        .trim(),
    body('capacity')
        .notEmpty().withMessage('Capacity is required.')
        .isInt({ min: 1 }).withMessage('Capacity must be a positive integer.'),
    body('startTime')
        .notEmpty().withMessage('Start time is required.')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('startTime must be in HH:MM format (00:00 to 23:59).'),
    body('endTime')
        .notEmpty().withMessage('End time is required.')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('startTime must be in HH:MM format (00:00 to 23:59).'),
    body('scheduledDate')
        .notEmpty().withMessage('Scheduled date is required.')
        .isISO8601().withMessage('Scheduled date must be a valid date in the format YYYY-MM-DD.')
];
export const validGetAllGroupSession = [
    query("coachId")
        .optional()
        .isMongoId()
        .withMessage("Coach Id must be a valid MongoDB ObjectId."),
    query('fromDate')
        .optional()
        .isISO8601().withMessage('From date must be a valid date in the format YYYY-MM-DD.'),
    query('toDate')
        .optional()
        .isISO8601().withMessage('To date must be a valid date in the format YYYY-MM-DD.'),
];
export const validateBookGroupSession = [
    body("children")
        .isArray({ min: 1 }).withMessage("At least one child must be provided."),

    body("children.*.childId")
        .notEmpty().withMessage("Child ID is required.")
        .isMongoId().withMessage("Child ID must be a valid MongoDB ObjectId."),

    body("children.*.age")
        .notEmpty().withMessage("Age is required.")
        .isInt({ min: 1 }).withMessage("Age must be a valid positive integer."),

    query("sessionId")
        .notEmpty().withMessage("Session ID is required.")
        .isMongoId().withMessage("Session ID must be a valid MongoDB ObjectId."),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Email must be valid."),

    body("productId")
        .trim()
        .notEmpty().withMessage("Product ID is required.")
        .isString().withMessage("Product ID must be a string."),

    body("priceId")
        .trim()
        .notEmpty().withMessage("Price ID is required.")
        .isString().withMessage("Price ID must be a string.")
];
export const validateAddLocation = [
  body("locations")
    .isArray({ min: 1 }).withMessage("Locations must be a non-empty array."),

  body("locations.*")
    .trim()
    .notEmpty().withMessage("Each location must be a non-empty string.")
];
export const validateUpdateLocation = [
    query("locationId")
        .notEmpty().withMessage("Location ID is required.")
        .isMongoId().withMessage("Location ID must be a valid MongoDB ObjectId."),
    body("location")
        .trim()
        .notEmpty().withMessage("Location is required.")
];
export const validateAddSkill = [
    body("skills")
        .isArray({ min: 1 }).withMessage("Skills must be a non-empty array."),

    body("skills.*")
        .trim()
        .notEmpty().withMessage("Skill name cannot be empty.")
        .matches(/^[A-Za-z\s]+$/).withMessage("Skill must contain only letters.")
];
export const validateUpdateSkill = [
    query("skillId")
        .notEmpty().withMessage("Skill ID is required.")
        .isMongoId().withMessage("Skill ID must be a valid MongoDB ObjectId."),
    body("skill")
        .trim()
        .notEmpty().withMessage("Skill is required.")
];
export const validateDeleteSkill = [
    query("skillId")
        .notEmpty().withMessage("Skill ID is required.")
        .isMongoId().withMessage("Skill ID must be a valid MongoDB ObjectId.")
];
export const validateEditProductAmount = [
    body("productId")
        .trim()
        .notEmpty().withMessage("Product Id is required."),
    body("newPrice")
        .trim()
        .notEmpty().withMessage("NewPrice ID is required.")
        .isFloat({ gt: 0 }).withMessage("New price must be a positive number.")
];
export const validateAddSkillsByCoach = [
    query("childId")
        .trim()
        .notEmpty().withMessage("Child ID is required.")
        .isMongoId().withMessage("Child ID must be a valid MongoDB ObjectId."),
    body("skills")
        .isArray({ min: 1 }).withMessage("At least one skill must be provided."),
    body("skills.*.skillId")
        .trim()
        .notEmpty().withMessage("Skill ID is required.")
        .isMongoId().withMessage("Skill ID must be a valid MongoDB ObjectId."),
    body("skills.*.rating")
        .trim()
        .notEmpty().withMessage("Rating is required.")
        .isNumeric().withMessage("Rating must be a number.")
        .isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5."),
    body("skills.*.notes")
        .trim()
        .optional()
        .isString().withMessage("Notes must be a string.")
        .isLength({ max: 500 }).withMessage("Notes can be max 500 characters."),
];
export const validateGetAllSkillsByCoach = [
    query("childId")
        .trim()
        .notEmpty()
        .withMessage("Child Id is required.")
        .isMongoId()
        .withMessage("Child Id must be a valid MongoDB ObjectId.")
]
export const validateProgressReportOfChild = [
    query("childId")
        .trim()
        .notEmpty()
        .withMessage("Child Id is required.")
        .isMongoId()
        .withMessage("Child Id must be a valid MongoDB ObjectId.")
]
export const validatedeleteLocation = [
    query("locationId")
        .notEmpty().withMessage("Location ID is required.")
        .isMongoId().withMessage("Location ID must be a valid MongoDB ObjectId.")
];
export const validateMailByCoach = [
    body('to')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email in to'),
    body("subject")
        .trim()
        .notEmpty().withMessage("Subject is required."),
    body("content")
        .trim()
        .notEmpty().withMessage("Content is required."),
        body("childId")
        .trim()
        .notEmpty().withMessage("Child ID is required.")
        .isMongoId().withMessage("Child ID must be a valid MongoDB ObjectId."),
        body("sessionId")
        .trim()
        .notEmpty().withMessage("Session ID is required.")
        .isMongoId().withMessage("Session ID must be a valid MongoDB ObjectId."),
        body("coachId")
        .trim()
        .notEmpty().withMessage("Coach ID is required.")
        .isMongoId().withMessage("Child ID must be a valid MongoDB ObjectId."),
];