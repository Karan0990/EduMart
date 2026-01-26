import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

export default async function resetEmail({
  useremail,
  userName,
  token
}: {
  useremail: string
  userName: string
  token: string
}) {
  const resetLink = `http://localhost:3000/reset-password/${token}`

  const info = await transporter.sendMail({
    from: `"Admin Team" <${process.env.EMAIL_USER}>`,
    to: useremail,
    subject: "Reset Your Password – Secure Link Inside",
    text: `Hello ${userName},

We received a request to reset your account password.

Use the link below to reset your password:
${resetLink}

This link will expire in 15 minutes.

If you did not request this, please ignore this email.

Regards,
Admin Team
`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Password Reset Request</h2>

        <p>Hello <strong>${userName}</strong>,</p>

        <p>
          We received a request to reset the password for your account.
          Click the button below to set a new password.
        </p>

        <p style="margin: 20px 0;">
          <a 
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #2563eb;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This link will expire in <strong>15 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore this email.
        </p>

        <p>
          Regards,<br />
          <strong>Admin Team</strong>
        </p>

        <hr />

        <p style="font-size: 12px; color: #666;">
          This is an automated email. Please do not reply.
        </p>
      </div>
    `
  })

  console.log("Message sent:", info.messageId)
}
