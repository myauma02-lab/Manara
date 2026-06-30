export declare const sendContactNotification: (data: {
    name: string;
    email: string;
    purpose: string;
    message: string;
}) => Promise<void>;
export declare const sendApplicationNotification: (data: {
    fullName: string;
    email: string;
    position: string;
    batchName: string;
}) => Promise<void>;
export declare const sendApplicationConfirmation: (data: {
    fullName: string;
    email: string;
    position: string;
    appId: string;
}) => Promise<void>;
export declare const sendNewsletterConfirmation: (data: {
    email: string;
    name?: string;
}) => Promise<void>;
export declare const sendStatusUpdateEmail: (data: {
    fullName: string;
    email: string;
    position: string;
    status: string;
    adminNotes?: string;
}) => Promise<void>;
//# sourceMappingURL=emailService.d.ts.map