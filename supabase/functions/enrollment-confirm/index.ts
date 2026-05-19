import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { student_email, student_name, course_title, enrollment_id } = await req.json();

    if (!student_email || !course_title) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: student_email, course_title" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log the enrollment confirmation (in production, this would send an email via a service like Resend)
    console.log(`[Enrollment Confirmation] Email sent to: ${student_email}`);
    console.log(`  Student: ${student_name || "Student"}`);
    console.log(`  Course: ${course_title}`);
    console.log(`  Enrollment ID: ${enrollment_id || "N/A"}`);
    console.log(`  Timestamp: ${new Date().toISOString()}`);

    // In production, you would integrate with an email service here:
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'LearnHub <noreply@learnhub.com>',
    //     to: student_email,
    //     subject: `Enrollment Confirmed: ${course_title}`,
    //     html: `
    //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //         <div style="background: #1e40af; padding: 24px; border-radius: 12px 12px 0 0;">
    //           <h1 style="color: white; margin: 0; font-size: 24px;">LearnHub</h1>
    //         </div>
    //         <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
    //           <h2 style="color: #0f172a; font-size: 20px;">Enrollment Confirmed!</h2>
    //           <p style="color: #475569; font-size: 16px;">Hello ${student_name || "Student"},</p>
    //           <p style="color: #475569; font-size: 16px;">You have been successfully enrolled in <strong>${course_title}</strong>.</p>
    //           <p style="color: #475569; font-size: 16px;">We're excited to have you on board! Start learning today by visiting your dashboard.</p>
    //           <a href="${new URL(req.headers.get('origin') || 'https://learnhub.com').origin}/dashboard"
    //              style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
    //             Go to Dashboard
    //           </a>
    //           <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">If you did not enroll in this course, please contact us immediately.</p>
    //         </div>
    //       </div>
    //     `,
    //   }),
    // });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Enrollment confirmation processed for ${student_email}`,
        course: course_title,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing enrollment confirmation:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
