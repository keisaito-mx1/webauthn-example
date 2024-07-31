/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript:{
        tsconfigPath: './tsconfig.build.json'
    }
};

module.exports = nextConfig;
