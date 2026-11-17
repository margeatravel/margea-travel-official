interface CitySchemaMarkupProps {
  cityName: string;
  citySlug: string;
  pageType: "pillar" | "oceanfront" | "with-pool" | "by-owner" | "pet-friendly" | "long-term";
}

export function CitySchemaMarkup({ cityName, citySlug, pageType }: CitySchemaMarkupProps) {
  const baseUrl = "https://margeatravel.com";
  
  const lodgingBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": `Margea ${cityName} Vacation Rentals`,
    "description": `Professionally managed vacation rentals in ${cityName}, Mexico. Direct booking with local support and concierge services.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": "Quintana Roo",
      "addressCountry": "MX"
    },
    "priceRange": "$$-$$$",
    "url": `${baseUrl}/stays/${citySlug}`
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How far is ${cityName} from Cancun Airport?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${cityName} is easily accessible from Cancun International Airport. Contact us for exact distance and transfer pricing.`
        }
      },
      {
        "@type": "Question",
        "name": `What activities are available in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${cityName} offers amazing snorkeling, diving, beach activities, and access to cenotes and Mayan ruins.`
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between booking with Margea vs booking platforms?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Booking direct with Margea means no platform service fees. You get direct contact with property managers and 24/7 WhatsApp support."
        }
      },
      {
        "@type": "Question",
        "name": `Are ${cityName} vacation rentals safe?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, ${cityName} is a safe destination in the Riviera Maya. Most properties are in secure communities with 24/7 security.`
        }
      },
      {
        "@type": "Question",
        "name": `What's the best time to visit ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "December through April offers the best weather. May-June and September-November are shoulder season with lower prices."
        }
      },
      {
        "@type": "Question",
        "name": `Do I need a car in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not necessarily. Many restaurants and shops are walkable. However, a car is helpful for visiting cenotes and nearby attractions."
        }
      },
      {
        "@type": "Question",
        "name": `What amenities are included in ${cityName} rentals?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most properties include WiFi, air conditioning, full kitchens, and weekly cleaning. Many have pools and beach equipment."
        }
      }
    ]
  };

  const getBreadcrumbSchema = () => {
    const items = [
      { position: 1, name: "Home", item: baseUrl },
      { position: 2, name: "Stays", item: `${baseUrl}/stays` },
      { position: 3, name: cityName, item: `${baseUrl}/stays/${citySlug}` }
    ];

    if (pageType !== "pillar") {
      const pageNames: Record<string, string> = {
        "oceanfront": "Oceanfront",
        "with-pool": "With Pool",
        "by-owner": "By Owner",
        "pet-friendly": "Pet-Friendly",
        "long-term": "Long-Term"
      };
      items.push({
        position: 4,
        name: pageNames[pageType] || pageType,
        item: `${baseUrl}/stays/${citySlug}/${pageType}`
      });
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map(item => ({
        "@type": "ListItem",
        "position": item.position,
        "name": item.name,
        "item": item.item
      }))
    };
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingBusinessSchema) }}
      />
      {pageType === "pillar" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbSchema()) }}
      />
    </>
  );
}
