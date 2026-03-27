export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await req.json();
        const {
            submittedAt,
            userType,
            email,
            canContact,
            usedProduct,
            usedAreas,
            rating,
            likedMost,
            frustrations,
            nextFeature
        } = body;

        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (!RESEND_API_KEY) {
            throw new Error('Missing RESEND_API_KEY environment variable. Cannot send email.');
        }

        const htmlContent = `
            <div style="font-family: sans-serif; max-w-2xl; margin: 0 auto; color: #333;">
                <h2 style="color: #4f46e5;">New MVP Feedback Received</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <p><strong>Date:</strong> ${new Date(submittedAt).toLocaleString()}</p>
                    <p><strong>User Type:</strong> ${userType}</p>
                    <p><strong>User Email:</strong> ${email || 'Not provided'}</p>
                    <p><strong>Okay to Contact:</strong> ${canContact ? '✅ Yes' : '❌ No'}</p>
                </div>
                
                <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Usage Experience</h3>
                <p><strong>Used for a real project:</strong> ${usedProduct ? 'Yes' : 'No'}</p>
                <p><strong>Areas Used:</strong> ${usedAreas?.length > 0 ? usedAreas.join(', ') : 'None selected'}</p>
                <p><strong>Overall Rating:</strong> ⭐ ${rating}/5</p>
                
                <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Detailed Feedback</h3>
                <p><strong>Liked Most:</strong><br/> ${likedMost || '<em>No response</em>'}</p>
                <p><strong>Frustrations / Confusions:</strong><br/> ${frustrations || '<em>No response</em>'}</p>
                <p><strong>Requested Feature:</strong><br/> ${nextFeature || '<em>No response</em>'}</p>
            </div>
        `;

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Feedback Portal <onboarding@resend.dev>', // Resend testing email domain
                to: ['akkadouail8@gmail.com'],
                subject: `New Feedback from ${userType} - ${rating}/5 Stars`,
                html: htmlContent
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to send email via Resend API');
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('Feedback submission error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
