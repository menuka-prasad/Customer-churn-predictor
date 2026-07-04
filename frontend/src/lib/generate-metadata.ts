import { SITE_CONFIG, DEFAULT_METADATA } from '@/config/site';

interface PageMetaData {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    noIndex?: boolean;
    canonicalUrl?: string; // Optional page-specific canonical URL
}

export function generateMetadata(meta: PageMetaData) {
    const description = meta.description || DEFAULT_METADATA.description;
    const ogImage = meta.ogImage || SITE_CONFIG.defaultOgImage;

    // Construct the full title
    const formattedTitle = meta.title
        ? DEFAULT_METADATA.title.template.replace('%s', meta.title)
        : DEFAULT_METADATA.title.default;

    // Handle canonical URL
    const canonicalUrl = meta.canonicalUrl
        ? (meta.canonicalUrl.startsWith('http') ? meta.canonicalUrl : `${SITE_CONFIG.url}${meta.canonicalUrl}`)
        : SITE_CONFIG.url;

    const twitterCreator = SITE_CONFIG.socialLinks.twitter ? SITE_CONFIG.socialLinks.twitter.replace('https://twitter.com/', '@') : undefined;

    return {
        title: meta.title ? meta.title : DEFAULT_METADATA.title.default,
        description,
        keywords: meta.keywords && meta.keywords.length > 0 ? meta.keywords.join(', ') : DEFAULT_METADATA.keywords.join(', '),
        robots: meta.noIndex ? 'noindex, nofollow' : 'index, follow',

        // Verification
        verification: {
            google: SITE_CONFIG.verification.google,
            yandex: SITE_CONFIG.verification.yandex,
            bing: SITE_CONFIG.verification.bing,
        },

        // Open Graph
        openGraph: {
            title: formattedTitle,
            description,
            images: [{
                url: ogImage,
                width: 1200,
                height: 630,
                alt: formattedTitle,
            }],
            url: canonicalUrl,
            type: 'website',
            siteName: SITE_CONFIG.name,
            locale: 'en_US',
        },

        // Twitter Card
        twitter: {
            card: 'summary_large_image',
            title: formattedTitle,
            description,
            images: [ogImage],
            creator: twitterCreator,
        },

        // Canonical URL
        alternates: {
            canonical: canonicalUrl,
        },
    };
}
