import { StaticContentPage } from "./StaticContentPage";

export function AboutPage() {
  return (
    <StaticContentPage
      title="About"
      canonicalPath="/about"
      intro="Speedhare consolidates public race results from road races across Hong Kong into one comprehensive, easily searchable database."
      sections={[
        {
          heading: "What we do",
          body: [
            "We aggregate and organize race metadata so runners can quickly find past results, track their performance over time, and gain valuable insights across events.",
            "Our goal is to build the most reliable and complete historical archive of Hong Kong road races, while providing useful analytics tools to help runners, organizers, and enthusiasts better understand the data.",
            "We only use official, publicly available downloadable documents released by race organizers. We do not scrape or crawl websites: everything we publish comes directly from public result files.",
          ],
        },
      ]}
    />
  );
}

export function TermsConditionsPage() {
  return (
    <StaticContentPage
      title="Terms & Conditions"
      canonicalPath="/terms"
      intro='Last updated: April 20, 2026. These Terms and Conditions ("Terms") govern your access to and use of Speedhare.io (the "Website" or "Service"), operated by Bahn Labs Ltd ("we", "us", or "our"). By accessing or using the Website, you agree to be bound by these Terms.'
      sections={[
        {
          heading: "1. Description of Service",
          body: [
            "Speedhare.io is a free informational website that aggregates and presents publicly available race results from Hong Kong races. We source data exclusively from official publicly downloadable PDF files and other public documents.",
            "We do not crawl or scrape websites. All data displayed originates from public sources.",
          ],
        },
        {
          heading: "2. Use of the Service",
          body: [
            "You may use the Service for personal, non-commercial purposes only, such as viewing, searching, or sharing race results.",
            "You agree not to use the Service for any illegal or unauthorized purpose; reproduce, distribute, or commercially exploit data or content without permission; attempt to circumvent technical measures; or overload or disrupt the Service.",
          ],
        },
        {
          heading: "3. Intellectual Property",
          body: [
            "All content on the Website, including design, logos, text, and compiled data presentations, is owned by or licensed to us, unless otherwise stated.",
            "Race results and underlying data are public information. We make no claim of ownership over original PDFs or official results and respect the rights of original data providers.",
            "You are granted a limited, non-exclusive, revocable license to view the content for personal use. Any other use requires prior written consent.",
          ],
        },
        {
          heading: "4. Accuracy and Disclaimer",
          body: [
            "We strive to present accurate and up-to-date information, but race results compiled from public sources may contain errors or omissions, and we do not guarantee completeness, accuracy, timeliness, or reliability.",
            'Results are provided "as is" without warranties of any kind. The Service is informational only and should not be relied upon for official records, timing disputes, or prize claims.',
          ],
        },
        {
          heading: "5. Limitation of Liability",
          body: [
            "To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including loss of data, profits, or inaccuracies in race results.",
            "Our total liability shall not exceed the amount you paid to us (currently zero).",
          ],
        },
        {
          heading: "6. Other terms",
          body: [
            "The Website may link to external sites and we are not responsible for their content or privacy practices.",
            "We may update the Service or these Terms at any time, and continued use after updates constitutes acceptance.",
            "We may suspend or terminate access at any time without notice for any reason.",
            "These Terms are governed by the laws of the Hong Kong Special Administrative Region and disputes are subject to the exclusive jurisdiction of Hong Kong courts.",
            "Contact us: https://www.linkedin.com/company/bahn-labs/",
          ],
        },
      ]}
    />
  );
}

export function DataPolicyPage() {
  return (
    <StaticContentPage
      title="Data Policy"
      canonicalPath="/data-policy"
      intro="Last updated: April 20, 2026. Bahn Labs Ltd operates https://speedhare.io/. This Privacy Policy explains how we collect, use, disclose, and safeguard your information."
      sections={[
        {
          heading: "1. Information We Collect",
          body: [
            "We collect minimal personal information because our Service is a public informational tool focused on race results.",
            "Automatically collected data may include IP address, browser type/version, device type, operating system, referring website, pages visited and time spent, and general geographic location.",
            "We do not require account creation or personal details to use the Service and do not collect personally identifiable information unless you voluntarily contact us.",
            "We may use essential cookies for basic website functionality and do not use tracking cookies for advertising or profiling.",
          ],
        },
        {
          heading: "2. How We Use the Information",
          body: [
            "We use automatically collected data solely for operating, maintaining, and improving the Service; analyzing usage and performance; detecting abuse or technical problems; and generating anonymous aggregate statistics.",
            "We do not sell, rent, or trade user data.",
          ],
        },
        {
          heading: "3. Sharing of Information",
          body: [
            "We do not share personal information with third parties except service providers helping operate the website, legal requirements, or to protect rights, safety, and property.",
            'Race results data displayed on the site comes from public sources and is generally not "personal data" under most privacy laws.',
          ],
        },
        {
          heading: "4. Storage, rights, and contact",
          body: [
            "Automatically collected logs are stored securely and retained only as long as needed (typically a few months), with reasonable security measures in place.",
            "Depending on your location, you may have rights to access or request deletion of personal data we hold and to object to processing.",
            "This Service is intended for users aged 18 and above only. We do not knowingly collect, use, or disclose personal data from anyone under 18.",
            'We may update this policy from time to time and will post updates with a revised "Last updated" date.',
            "Contact us: https://www.linkedin.com/company/bahn-labs",
          ],
        },
      ]}
    />
  );
}
