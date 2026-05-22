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
    const { student_email, student_name, course_title, payment_amount, transaction_id, upi_id } = await req.json();

    if (!student_email || !course_title) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log payment notification
    console.log(`[Payment Notification] Payment received`);
    console.log(`  Student: ${student_name || "Student"}`);
    console.log(`  Email: ${student_email}`);
    console.log(`  Course: ${course_title}`);
    console.log(`  Amount: ${payment_amount || "400"} Rs`);
    console.log(`  Transaction ID: ${transaction_id || "N/A"}`);
    console.log(`  UPI ID: ${upi_id || "N/A"}`);
    console.log(`  Timestamp: ${new Date().toISOString()}`);

    // In production, integrate with email service (Resend, SendGrid, etc.)
    // const emailResponse = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'Cyber Spyde <noreply@cyberspyde.com>',
    //     to: 'cyberspyde64@gmail.com',
    //     replyTo: student_email,
    //     subject: `Payment Received - Course Enrollment: ${course_title}`,
    //     html: `
    //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //         <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 24px; border-radius: 12px 12px 0 0;">
    //           <h1 style="color: white; margin: 0; font-size: 24px;">Payment Received</h1>
    //         </div>
    //         <div style="padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0;">
    //           <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 16px;">Enrollment Confirmed</h2>
    //           <p style="color: #475569; font-size: 14px; margin: 8px 0;"><strong>Student Name:</strong> ${student_name || "Student"}</p>
    //           <p style="color: #475569; font-size: 14px; margin: 8px 0;"><strong>Student Email:</strong> ${student_email}</p>
    //           <p style="color: #475569; font-size: 14px; margin: 8px 0;"><strong>Course:</strong> ${course_title}</p>
    //           <p style="color: #475569; font-size: 14px; margin: 8px 0;"><strong>Amount Paid:</strong> ₹${payment_amount || "400"}</p>
    //           <p style="color: #475569; font-size: 14px; margin: 8px 0;"><strong>Transaction ID:</strong> ${transaction_id || "N/A"}</p>
    //           <p style="color: #475569; font-size: 14px; margin: 8px 0;"><strong>Payment Date:</strong> ${new Date().toISOString()}</p>
    //         </div>
    //       </div>
    //     `,
    //   }),
    // });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Payment notification processed for ${student_email}`,
        course: course_title,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing payment notification:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
