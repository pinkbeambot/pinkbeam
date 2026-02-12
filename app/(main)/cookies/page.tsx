import { Metadata } from 'next'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: 'Cookie Policy — Pink Beam',
  description: 'Understand how Pink Beam uses cookies and similar technologies to improve your experience. Manage your cookie preferences and learn about our tracking practices.',
}

export default function CookiesPage() {
  return (
    <Container className="py-20">
      <article className="prose prose-gray dark:prose-invert max-w-4xl mx-auto">
        <h1>Cookie Policy</h1>
        <p className="text-sm text-muted-foreground">Last Updated: February 11, 2026</p>

        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a
          website. They are widely used to make websites work more efficiently and provide information to
          website owners.
        </p>

        <h2>2. How We Use Cookies</h2>
        <p>Pink Beam uses cookies and similar technologies to:</p>
        <ul>
          <li>Keep you signed in to your account</li>
          <li>Remember your preferences and settings</li>
          <li>Understand how you use our Services to improve them</li>
          <li>Protect against fraud and enhance security</li>
          <li>Analyze performance and traffic patterns</li>
        </ul>

        <h2>3. Types of Cookies We Use</h2>

        <h3>Essential Cookies (Required)</h3>
        <p>
          These cookies are necessary for our Services to function properly. They enable core functionality
          such as authentication, security, and accessibility. You cannot opt out of these cookies.
        </p>
        <table>
          <thead>
            <tr>
              <th>Cookie Name</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>pb-session</code></td>
              <td>Authentication session management</td>
              <td>Session / 30 days</td>
            </tr>
            <tr>
              <td><code>pb-cookie-consent</code></td>
              <td>Stores your cookie consent preferences</td>
              <td>1 year</td>
            </tr>
            <tr>
              <td><code>sb-*</code></td>
              <td>Supabase authentication tokens</td>
              <td>Session / 7 days</td>
            </tr>
          </tbody>
        </table>

        <h3>Analytics Cookies (Optional)</h3>
        <p>
          These cookies help us understand how visitors interact with our website. We use privacy-focused
          analytics that don't track you across websites.
        </p>
        <table>
          <thead>
            <tr>
              <th>Cookie Name</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>plausible_*</code></td>
              <td>Anonymous usage analytics (GDPR compliant)</td>
              <td>24 hours</td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>Note:</strong> Plausible Analytics does not use cookies to track individual users and does
          not collect personal data. It provides aggregate statistics only.
        </p>

        <h3>Functional Cookies (Optional)</h3>
        <p>These cookies enable enhanced functionality and personalization.</p>
        <table>
          <thead>
            <tr>
              <th>Cookie Name</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>pb-theme</code></td>
              <td>Remembers your dark/light mode preference</td>
              <td>1 year</td>
            </tr>
            <tr>
              <td><code>pb-preferences</code></td>
              <td>Stores your dashboard and interface preferences</td>
              <td>1 year</td>
            </tr>
          </tbody>
        </table>

        <h2>4. Third-Party Cookies</h2>
        <p>Some of our service providers may set their own cookies:</p>

        <h3>Stripe (Payment Processing)</h3>
        <p>
          When you make a payment, Stripe sets cookies to process transactions securely and prevent fraud.
          These cookies are essential for payment processing.
        </p>
        <ul>
          <li><code>__stripe_mid</code> - Fraud prevention (1 year)</li>
          <li><code>__stripe_sid</code> - Payment session management (30 minutes)</li>
        </ul>
        <p>
          Learn more: <a href="https://stripe.com/cookies-policy" target="_blank" rel="noopener">Stripe Cookie Policy</a>
        </p>

        <h3>Plausible Analytics</h3>
        <p>
          We use Plausible for privacy-friendly analytics. Unlike Google Analytics, Plausible:
        </p>
        <ul>
          <li>Does not use cookies for cross-site tracking</li>
          <li>Does not collect personal data</li>
          <li>Is GDPR, CCPA, and PECR compliant by default</li>
          <li>Does not sell or share your data</li>
        </ul>
        <p>
          Learn more: <a href="https://plausible.io/data-policy" target="_blank" rel="noopener">Plausible Data Policy</a>
        </p>

        <h2>5. Managing Your Cookie Preferences</h2>

        <h3>Cookie Consent Banner</h3>
        <p>
          When you first visit our website, you'll see a cookie consent banner. You can choose to:
        </p>
        <ul>
          <li><strong>Accept All:</strong> Enable all cookies including analytics</li>
          <li><strong>Essential Only:</strong> Only use necessary cookies for core functionality</li>
          <li><strong>Customize:</strong> Choose which categories of cookies to enable</li>
        </ul>

        <h3>Browser Settings</h3>
        <p>You can also control cookies through your browser settings:</p>
        <ul>
          <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
          <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
          <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
        </ul>
        <p>
          <strong>Warning:</strong> Disabling essential cookies will prevent you from logging in and using
          core features of our Services.
        </p>

        <h3>Do Not Track (DNT)</h3>
        <p>
          Our analytics provider (Plausible) respects Do Not Track (DNT) browser signals. If you have DNT
          enabled, we will not collect analytics data from your visits.
        </p>

        <h2>6. Cookie Lifespan</h2>
        <p>Cookies are set to expire at different times:</p>
        <ul>
          <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
          <li><strong>Persistent Cookies:</strong> Remain until expiry date or manual deletion</li>
          <li><strong>First-Party Cookies:</strong> Set by pinkbeam.io</li>
          <li><strong>Third-Party Cookies:</strong> Set by our service providers (Stripe, Plausible)</li>
        </ul>

        <h2>7. Updates to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in our use of cookies or
          applicable laws. We encourage you to review this page periodically.
        </p>

        <h2>8. Contact Us</h2>
        <p>If you have questions about our use of cookies, please contact us:</p>
        <ul>
          <li>Email: <a href="mailto:privacy@pinkbeam.io">privacy@pinkbeam.io</a></li>
          <li>Privacy Dashboard: <a href="/portal/privacy">/portal/privacy</a> (when logged in)</li>
        </ul>

        <p className="text-sm text-muted-foreground mt-12">
          By continuing to use our Services, you consent to our use of cookies as described in this Cookie Policy.
        </p>
      </article>
    </Container>
  )
}
