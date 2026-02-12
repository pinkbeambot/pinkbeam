import { Metadata } from 'next'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: 'Privacy Policy — Pink Beam',
  description: 'Learn how Pink Beam collects, uses, and protects your personal data. Our privacy policy covers data handling for AI employees, project management, and account services.',
}

export default function PrivacyPage() {
  return (
    <Container className="py-20">
      <article className="prose prose-gray dark:prose-invert max-w-4xl mx-auto">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last Updated: February 11, 2026</p>

        <h2>1. Information We Collect</h2>
        <p>
          Pink Beam ("we," "us," or "our") collects information that you provide directly to us when you:
        </p>
        <ul>
          <li>Create an account and use our services</li>
          <li>Subscribe to our AI employee services or project packages</li>
          <li>Communicate with our AI employees (VALIS, Mike, Sarah, Alex, Casey, LUMEN, FLUX)</li>
          <li>Contact us for support or inquiries</li>
          <li>Subscribe to our newsletter or marketing communications</li>
        </ul>

        <h3>Personal Information</h3>
        <ul>
          <li><strong>Account Information:</strong> Name, email address, company name, phone number</li>
          <li><strong>Billing Information:</strong> Payment method details (processed securely by Stripe)</li>
          <li><strong>Usage Data:</strong> AI interaction history, project details, conversation logs</li>
          <li><strong>Technical Data:</strong> IP address, browser type, device information, usage patterns</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our AI employee services</li>
          <li>Process payments and send transactional emails</li>
          <li>Customize and personalize AI employee responses based on your preferences</li>
          <li>Send you service updates, security alerts, and administrative messages</li>
          <li>Respond to your comments, questions, and customer service requests</li>
          <li>Monitor and analyze usage patterns to improve our services</li>
          <li>Detect, prevent, and address technical issues and fraudulent activity</li>
          <li>Send you marketing communications (with your consent)</li>
        </ul>

        <h2>3. Third-Party Services</h2>
        <p>We use the following third-party services that may collect and process your data:</p>
        <ul>
          <li><strong>Supabase:</strong> Database hosting and authentication</li>
          <li><strong>Stripe:</strong> Payment processing and billing management</li>
          <li><strong>Anthropic (Claude API):</strong> AI model for powering our AI employees</li>
          <li><strong>Resend:</strong> Transactional email delivery</li>
          <li><strong>Plausible Analytics:</strong> Privacy-focused website analytics (GDPR compliant)</li>
          <li><strong>Vercel:</strong> Website hosting and infrastructure</li>
        </ul>

        <h2>4. Data Storage and Security</h2>
        <p>
          Your data is stored securely using industry-standard encryption. We implement appropriate technical
          and organizational measures to protect your personal information against unauthorized access,
          alteration, disclosure, or destruction.
        </p>
        <p>
          Conversation data with AI employees is encrypted in transit and at rest. Payment information is
          processed by Stripe and never stored on our servers.
        </p>

        <h2>5. Data Retention</h2>
        <ul>
          <li><strong>Account Data:</strong> Retained while your account is active and for 30 days after deletion request</li>
          <li><strong>Conversation History:</strong> Retained for the duration of your subscription</li>
          <li><strong>Billing Records:</strong> Retained for 7 years for tax and compliance purposes</li>
          <li><strong>Analytics Data:</strong> Anonymized and retained indefinitely for service improvement</li>
        </ul>

        <h2>6. Your Privacy Rights</h2>
        <p>Depending on your location, you may have the following rights:</p>

        <h3>GDPR Rights (EU Residents)</h3>
        <ul>
          <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
          <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
          <li><strong>Right to Portability:</strong> Receive your data in a machine-readable format</li>
          <li><strong>Right to Object:</strong> Object to certain processing of your data</li>
          <li><strong>Right to Restrict Processing:</strong> Request limited processing of your data</li>
        </ul>

        <h3>CCPA Rights (California Residents)</h3>
        <ul>
          <li>Right to know what personal information is collected</li>
          <li>Right to know whether personal information is sold or shared</li>
          <li>Right to opt-out of the sale or sharing of personal information</li>
          <li>Right to request deletion of personal information</li>
          <li>Right to non-discrimination for exercising your rights</li>
        </ul>

        <p>
          <strong>Note:</strong> We do NOT sell your personal information to third parties.
        </p>

        <h2>7. Exercising Your Rights</h2>
        <p>To exercise any of your privacy rights:</p>
        <ul>
          <li>Visit your <a href="/portal/privacy">Privacy Dashboard</a> (when logged in)</li>
          <li>Email us at <a href="mailto:privacy@pinkbeam.io">privacy@pinkbeam.io</a></li>
          <li>Use the data export or account deletion features in your dashboard</li>
        </ul>
        <p>We will respond to your request within 30 days.</p>

        <h2>8. Cookies and Tracking</h2>
        <p>
          We use cookies and similar tracking technologies. See our <a href="/cookies">Cookie Policy</a> for
          detailed information about the cookies we use and how to manage your preferences.
        </p>

        <h2>9. Children's Privacy</h2>
        <p>
          Our services are not directed to children under 13 (or 16 in the EU). We do not knowingly collect
          personal information from children. If you believe we have collected information from a child,
          please contact us immediately.
        </p>

        <h2>10. International Data Transfers</h2>
        <p>
          Your data may be transferred to and processed in countries other than your country of residence.
          We ensure appropriate safeguards are in place for such transfers, including Standard Contractual
          Clauses approved by the European Commission.
        </p>

        <h2>11. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any material changes
          by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage
          you to review this Privacy Policy periodically.
        </p>

        <h2>12. Contact Us</h2>
        <p>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
        <ul>
          <li>Email: <a href="mailto:privacy@pinkbeam.io">privacy@pinkbeam.io</a></li>
          <li>Address: Pink Beam, Inc., [Company Address]</li>
          <li>Data Protection Officer: <a href="mailto:dpo@pinkbeam.io">dpo@pinkbeam.io</a></li>
        </ul>

        <p className="text-sm text-muted-foreground mt-12">
          This Privacy Policy is effective as of the date stated at the top of this policy. Your continued
          use of our services after any changes indicates your acceptance of the updated policy.
        </p>
      </article>
    </Container>
  )
}
