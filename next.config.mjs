/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
      remotePatterns: [
        {
            protocol: 'https',
            hostname: 'picsum.photos',
            port: '',
            pathname: '/**', 
        },
        {
          protocol: 'https',
          hostname: 'wkdadibiop1ccci7.public.blob.vercel-storage.com',
          port: '',
          pathname: '/**', 
      },
       
      ],
    },
  }

export default nextConfig;
