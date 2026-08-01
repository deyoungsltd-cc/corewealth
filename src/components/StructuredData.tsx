export default function StructuredData() {
  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://corewealthbank.com';
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'CoreWealth Bank',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Professionally managed investment platform offering daily returns up to 1.8% across diversified strategies.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'London',
      addressCountry: 'GB',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'corewealthprimesupportt@gmail.com',
      contactType: 'customer support',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://twitter.com/CoreWealthPrimeCap',
      'https://linkedin.com/company/corewealth-prime-capital',
      'https://t.me/CoreWealthPrimeCapital',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CoreWealth Bank',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/faq?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does CoreWealth Bank generate returns?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our fund managers deploy capital across diversified strategies including savings accounts, investment portfolios, and wealth management services for consistent daily returns.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my initial investment protected?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, your principal is returned in full at the end of your plan duration. We maintain a capital reserve fund to ensure all investor principals are secured.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I withdraw my earnings?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Navigate to Withdraw in your dashboard, enter the amount and bank account details. Withdrawals are processed within minutes for verified accounts.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
