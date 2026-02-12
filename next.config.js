/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: "export", // 添加这行
	images: {
		unoptimized: true, // 静态导出需要禁用图片优化
	},
};

module.exports = nextConfig;
