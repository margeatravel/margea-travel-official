interface AkumalSchemaMarkupProps {
  pageType: "pillar" | "oceanfront" | "with-pool" | "by-owner" | "pet-friendly" | "long-term";
}

export function AkumalSchemaMarkup({ pageType }: AkumalSchemaMarkupProps) {
  const baseUrl = "https://margeatravel.com";
  
  const lodgingBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Margea Akumal Vacation Rentals",
    "description": "Professionally managed vacation rentals in Akumal, Mexico. Direct booking with local support and concierge services.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Akumal",
      "addressRegion": "Quintana Roo",
      "addressCountry": "MX"
    },
    "priceRange": "$$-$$$",
    "url": `${baseUrl}/stays/akumal`
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How far is Akumal from Cancun Airport?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Akumal is approximately 60 miles (95 km) south of Cancun International Airport, about a 90-minute drive via Highway 307."
        }
      },
      {
        "@type": "Question",
        "name": "Can you really swim with turtles in Akumal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Sea turtles feed in Akumal Bay year-round. Simply bring snorkel gear and wade into the shallow water. The best time is morning when waters are calmest."
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
        "name": "Are Akumal vacation rentals safe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Akumal is one of the safest areas in Riviera Maya. Most properties are in gated communities with 24/7 security."
        }
      },
      {
        "@type": "Question",
        "name": "What's the best time to visit Akumal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "December through April offers the best weather. May-June and September-November are shoulder season with lower prices."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need a car in Akumal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not necessarily. Many restaurants and shops are walkable. However, a car is helpful for visiting cenotes, Tulum, and Playa del Carmen."
        }
      },
      {
        "@type": "Question",
        "name": "What amenities are included in Akumal rentals?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most properties include WiFi, air conditioning, full kitchens, beach access, and weekly cleaning. Many have private pools and beach equipment."
        }
      }
    ]
  };

  const getBreadcrumbSchema = () => {
    const items = [
      { position: 1, name: "Home", item: baseUrl },
      { position: 2, name: "Stays", item: `${baseUrl}/stays` },
      { position: 3, name: "Akumal", item: `${baseUrl}/stays/akumal` }
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
        item: `${baseUrl}/stays/akumal/${pageType}`
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
