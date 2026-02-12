import { Metadata } from 'next'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: 'Terms of Service — Pink Beam',
  description: 'Read the Pink Beam Terms of Service governing use of our AI employees, web development, custom software, and consulting services. Updated February 2026.',
}

export default function TermsPage() {
  return (
    <Container className="py-20">
      <article className="prose prose-gray dark:prose-invert max-w-4xl mx-auto">
        <h1>Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last Updated: February 11, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Pink Beam's services ("Services"), you agree to be bound by these Terms of
          Service ("Terms"). If you do not agree to these Terms, do not use our Services.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you and Pink Beam, Inc. ("Pink Beam,"
          "we," "us," or "our").
        </p>

        <h2>2. Description of Services</h2>
        <p>Pink Beam provides the following services:</p>
        <ul>
          <li><strong>AI Employees (Agents):</strong> Subscription-based AI-powered assistants including VALIS (hub), Mike (SDR), Sarah (Research), Alex (Support), Casey (Content), LUMEN (Design), and FLUX (Video)</li>
          <li><strong>Web Development:</strong> Website design, development, and maintenance services</li>
          <li><strong>Custom Software (Labs):</strong> Custom application development and MVP builds</li>
          <li><strong>Strategic Consulting (Solutions):</strong> Technology strategy and digital transformation consulting</li>
        </ul>

        <h2>3. Account Registration</h2>
        <p>To use our Services, you must:</p>
        <ul>
          <li>Be at least 18 years old or the age of legal majority in your jurisdiction</li>
          <li>Provide accurate, current, and complete information during registration</li>
          <li>Maintain the security of your account credentials</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
        </ul>
        <p>
          You are responsible for all activities that occur under your account.
        </p>

        <h2>4. Subscription Terms (AI Employees)</h2>

        <h3>4.1 Plans and Billing</h3>
        <ul>
          <li>Subscriptions are billed monthly or annually based on your selected plan</li>
          <li>All fees are non-refundable except as required by law</li>
          <li>Prices are subject to change with 30 days' notice</li>
          <li>You authorize us to charge your payment method for recurring subscription fees</li>
        </ul>

        <h3>4.2 Usage Limits</h3>
        <ul>
          <li>Each plan includes a monthly interaction/usage limit</li>
          <li>Exceeding your plan limits may result in additional charges or service restrictions</li>
          <li>Usage resets at the start of each billing cycle</li>
        </ul>

        <h3>4.3 Cancellation</h3>
        <ul>
          <li>You may cancel your subscription at any time from your account dashboard</li>
          <li>Cancellations take effect at the end of your current billing period</li>
          <li>Access to AI employees will be disabled after cancellation</li>
          <li>Conversation history will be retained for 30 days after cancellation</li>
        </ul>

        <h2>5. Project-Based Services (Web, Labs, Solutions)</h2>
        <ul>
          <li>Project scope, timeline, and pricing are defined in individual proposals or quotes</li>
          <li>Payment terms vary by project (typically 50% upfront, 50% on completion)</li>
          <li>Changes to project scope may result in additional fees</li>
          <li>Delivery timelines are estimates and not guarantees</li>
          <li>You must provide timely feedback and necessary materials for project completion</li>
        </ul>

        <h2>6. Acceptable Use Policy</h2>
        <p>You agree NOT to use our Services to:</p>
        <ul>
          <li>Violate any laws or regulations</li>
          <li>Infringe on intellectual property rights of others</li>
          <li>Generate, distribute, or facilitate illegal content</li>
          <li>Harass, abuse, or harm others</li>
          <li>Distribute spam, malware, or phishing content</li>
          <li>Attempt to circumvent usage limits or security measures</li>
          <li>Reverse engineer or attempt to extract AI model weights</li>
          <li>Use AI employees to generate content for purposes that violate Anthropic's Acceptable Use Policy</li>
          <li>Impersonate others or misrepresent your affiliation</li>
          <li>Interfere with or disrupt our Services or servers</li>
        </ul>
        <p>
          Violation of this policy may result in immediate suspension or termination of your account.
        </p>

        <h2>7. Intellectual Property</h2>

        <h3>7.1 Our Rights</h3>
        <p>
          Pink Beam retains all rights, title, and interest in our Services, including our website, software,
          AI models, branding, and any content we create. You may not copy, modify, distribute, or create
          derivative works without our written permission.
        </p>

        <h3>7.2 Your Content</h3>
        <p>
          You retain ownership of any content you input into our Services. By using our Services, you grant
          us a limited license to process, store, and display your content as necessary to provide the Services.
        </p>

        <h3>7.3 AI-Generated Content</h3>
        <p>
          You own the output generated by our AI employees, subject to applicable law. However, identical or
          similar outputs may be generated for other users. We make no representations about the originality
          of AI-generated content.
        </p>

        <h3>7.4 Project Deliverables</h3>
        <p>
          For Web, Labs, and Solutions projects, intellectual property ownership is transferred to you upon
          full payment, except for: (a) pre-existing IP, (b) third-party components, and (c) our proprietary
          tools and frameworks.
        </p>

        <h2>8. Confidentiality</h2>
        <p>
          We will treat your business information and conversation history as confidential and will not
          disclose it to third parties except: (a) as required by law, (b) to provide the Services (e.g.,
          Anthropic API for AI processing), or (c) with your consent.
        </p>

        <h2>9. Warranties and Disclaimers</h2>
        <p className="uppercase font-semibold">
          OUR SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
          INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          OR NON-INFRINGEMENT.
        </p>
        <p>We do not warrant that:</p>
        <ul>
          <li>Our Services will be uninterrupted, secure, or error-free</li>
          <li>AI-generated content will be accurate, complete, or suitable for your purposes</li>
          <li>Defects will be corrected within a specific timeframe</li>
          <li>Our Services will meet your specific requirements</li>
        </ul>

        <h2>10. Limitation of Liability</h2>
        <p className="uppercase font-semibold">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, PINK BEAM SHALL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST DATA,
          OR BUSINESS INTERRUPTION, ARISING FROM YOUR USE OF OR INABILITY TO USE OUR SERVICES.
        </p>
        <p>
          Our total liability for any claims related to our Services shall not exceed the amount you paid
          us in the 12 months preceding the claim.
        </p>

        <h2>11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Pink Beam from any claims, damages, losses, liabilities,
          and expenses (including legal fees) arising from: (a) your use of our Services, (b) your violation
          of these Terms, or (c) your violation of any third-party rights.
        </p>

        <h2>12. Termination</h2>
        <p>
          We may suspend or terminate your access to our Services at any time, with or without cause, with
          or without notice. Upon termination:
        </p>
        <ul>
          <li>Your right to access and use our Services immediately ceases</li>
          <li>You remain liable for any unpaid fees</li>
          <li>We may delete your data after a 30-day grace period</li>
          <li>Sections that by their nature should survive (e.g., payment obligations, liability limitations) will survive termination</li>
        </ul>

        <h2>13. Dispute Resolution</h2>

        <h3>13.1 Governing Law</h3>
        <p>
          These Terms are governed by the laws of the State of [State], United States, without regard to
          conflict of law principles.
        </p>

        <h3>13.2 Arbitration</h3>
        <p>
          Any disputes arising from these Terms or our Services shall be resolved through binding arbitration
          under the rules of the American Arbitration Association. You waive your right to participate in
          class actions or class arbitrations.
        </p>

        <h3>13.3 Exceptions</h3>
        <p>
          Either party may seek injunctive relief in court to protect intellectual property rights or prevent
          irreparable harm.
        </p>

        <h2>14. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. We will notify you of material changes by email or through
          a prominent notice on our website. Your continued use of our Services after changes take effect
          constitutes acceptance of the modified Terms.
        </p>

        <h2>15. Miscellaneous</h2>
        <ul>
          <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and Pink Beam</li>
          <li><strong>Severability:</strong> If any provision is found invalid, the remaining provisions remain in effect</li>
          <li><strong>Waiver:</strong> Our failure to enforce any right does not waive that right</li>
          <li><strong>Assignment:</strong> You may not assign these Terms without our consent; we may assign freely</li>
          <li><strong>Force Majeure:</strong> We are not liable for delays or failures due to circumstances beyond our reasonable control</li>
        </ul>

        <h2>16. Contact Us</h2>
        <p>If you have questions about these Terms, please contact us:</p>
        <ul>
          <li>Email: <a href="mailto:legal@pinkbeam.io">legal@pinkbeam.io</a></li>
          <li>Support: <a href="mailto:support@pinkbeam.io">support@pinkbeam.io</a></li>
          <li>Address: Pink Beam, Inc., [Company Address]</li>
        </ul>

        <p className="text-sm text-muted-foreground mt-12">
          By using Pink Beam's Services, you acknowledge that you have read, understood, and agree to be
          bound by these Terms of Service.
        </p>
      </article>
    </Container>
  )
}
