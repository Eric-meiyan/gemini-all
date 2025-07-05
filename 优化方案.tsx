// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
const App: React.FC = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
return (
<div className="min-h-screen bg-gray-50">
{/* 顶部导航区域 */}
<header className="fixed top-0 left-0 right-0 bg-white bg-opacity-95 shadow-sm z-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex justify-between items-center h-16">
{/* Logo */}
<div className="flex-shrink-0 flex items-center">
<div className="text-2xl font-bold text-blue-700">
Gemini CLI Hub
</div>
</div>
{/* 导航菜单 - 桌面版 */}
<nav className="hidden md:flex space-x-8">
<a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">News</a>
<a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Tools</a>
<a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Blog</a>
<a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Developer Community</a>
</nav>
{/* 右侧功能区 */}
<div className="hidden md:flex items-center space-x-4">
<div className="relative">
<input
type="text"
placeholder="Search content..."
className="w-64 pl-10 pr-4 py-2 text-sm border-none rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
/>
<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
<i className="fas fa-search"></i>
</div>
</div>
<button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap !rounded-button">Login</button>
<button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm cursor-pointer whitespace-nowrap !rounded-button">Sign Up</button>
</div>
{/* 移动端菜单按钮 */}
<div className="md:hidden flex items-center">
<button
onClick={() => setIsMenuOpen(!isMenuOpen)}
className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 cursor-pointer whitespace-nowrap !rounded-button"
>
<i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
</button>
</div>
</div>
</div>
{/* 移动端菜单 */}
{isMenuOpen && (
<div className="md:hidden bg-white pt-2 pb-4 px-4">
<div className="space-y-1">
<a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md">News</a>
<a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md">Tools</a>
<a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md">Blog</a>
<a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md">Developer Community</a>
</div>
<div className="mt-4 pt-4 border-t border-gray-200">
<div className="relative mb-3">
<input
type="text"
placeholder="搜索内容..."
className="w-full pl-10 pr-4 py-2 text-sm border-none rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
/>
<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
<i className="fas fa-search"></i>
</div>
</div>
<div className="flex space-x-4">
<button className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 cursor-pointer whitespace-nowrap !rounded-button">登录</button>
<button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer whitespace-nowrap !rounded-button">注册</button>
</div>
</div>
</div>
)}
</header>
<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
{/* Banner 区域 */}
<div className="relative rounded-xl overflow-hidden mb-12 h-96">
<div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent z-10"></div>
<img
src="https://readdy.ai/api/search-image?query=A%20futuristic%20command%20line%20interface%20with%20Google%20Gemini%20AI%20visualization%2C%20showing%20code%20snippets%20and%20terminal%20commands%20with%20blue%20glowing%20elements%2C%20modern%20tech%20aesthetic%20with%20clean%20design%2C%20dark%20background%20with%20blue%20accent%20lighting&width=1200&height=400&seq=banner1&orientation=landscape"
alt="Gemini CLI 最新功能"
className="absolute inset-0 w-full h-full object-cover object-top"
/>
<div className="relative z-20 h-full flex items-center">
<div className="max-w-2xl px-8 py-6">
<span className="inline-block px-3 py-1 text-xs font-semibold text-blue-100 bg-blue-800 bg-opacity-70 rounded-full mb-4">Latest News</span>
<h1 className="text-4xl font-bold text-white mb-4">Google Releases Gemini CLI 2.0, Enhancing Developer Experience</h1>
<p className="text-lg text-blue-50 mb-6">The new Gemini CLI 2.0 brings smarter code completion, multi-language support, and more efficient workflow integration, helping developers improve coding efficiency by 50%.</p>
<button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg transition duration-200 cursor-pointer whitespace-nowrap !rounded-button">
Learn More <i className="fas fa-arrow-right ml-2"></i>
</button>
</div>
</div>
</div>
{/* 内容区域 */}
<div className="flex flex-col lg:flex-row gap-8">
{/* 主内容区 */}
<div className="lg:w-3/4">
<div className="mb-10">
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
<a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
View All <i className="fas fa-chevron-right ml-1 text-sm"></i>
</a>
</div>
<div className="grid md:grid-cols-2 gap-6">
{[1, 2, 3, 4].map((item) => (
<div key={`news-${item}`} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
<div className="h-48 overflow-hidden">
<img
src={`https://readdy.ai/api/search-image?query=Modern%20tech%20news%20illustration%20showing%20command%20line%20interface%20with%20code%20snippets%2C%20Google%20Gemini%20branding%20elements%2C%20clean%20minimalist%20design%20with%20blue%20accent%20colors%20on%20white%20background%2C%20professional%20tech%20visualization&width=600&height=300&seq=news${item}&orientation=landscape`}
alt="资讯图片"
className="w-full h-full object-cover object-top"
/>
</div>
<div className="p-5">
<div className="flex items-center text-sm text-gray-500 mb-2">
<span>2025-07-0{item}</span>
<span className="mx-2">•</span>
<span>Tech News</span>
</div>
<h3 className="text-xl font-semibold mb-2 text-gray-900">How Gemini CLI is Transforming Developer Workflows</h3>
<p className="text-gray-600 mb-4 line-clamp-2">An in-depth look at how Google's latest Gemini CLI tool enhances development efficiency through AI-assisted features, including smart code completion, automated testing, and documentation generation.</p>
<div className="flex items-center justify-between">
<div className="flex items-center">
<img
src={`https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20tech%20professional%20with%20neutral%20background%2C%20clean%20portrait%20style%2C%20minimalist%20lighting&width=100&height=100&seq=author${item}&orientation=squarish`}
alt="作者头像"
className="w-8 h-8 rounded-full mr-2"
/>
<span className="text-sm text-gray-700">张技术</span>
</div>
<div className="flex items-center space-x-3 text-gray-500 text-sm">
<span className="flex items-center"><i className="far fa-eye mr-1"></i> 1.2k</span>
<span className="flex items-center"><i className="far fa-comment mr-1"></i> 48</span>
</div>
</div>
</div>
</div>
))}
</div>
</div>
<div className="mb-10">
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl font-bold text-gray-900">Popular Tool Reviews</h2>
<a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
View All <i className="fas fa-chevron-right ml-1 text-sm"></i>
</a>
</div>
<div className="grid md:grid-cols-2 gap-6">
{[1, 2].map((item) => (
<div key={`tool-${item}`} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
<div className="h-48 overflow-hidden">
<img
src={`https://readdy.ai/api/search-image?query=Developer%20using%20Gemini%20CLI%20tool%20on%20computer%20screen%2C%20showing%20terminal%20with%20code%20completion%20features%2C%20professional%20workspace%20setup%20with%20modern%20tech%20aesthetic%2C%20blue%20accent%20lighting&width=600&height=300&seq=tool${item}&orientation=landscape`}
alt="工具体验图片"
className="w-full h-full object-cover object-top"
/>
</div>
<div className="p-5">
<div className="flex items-center text-sm text-gray-500 mb-2">
<span>2025-07-0{item}</span>
<span className="mx-2">•</span>
<span>Tool Review</span>
</div>
<h3 className="text-xl font-semibold mb-2 text-gray-900">I Refactored My Entire Project with Gemini CLI, Boosting Efficiency by 40%</h3>
<p className="text-gray-600 mb-4 line-clamp-2">A detailed account of how I used Gemini CLI's code refactoring features to complete a month's worth of code optimization in just one week, including real-world cases and efficiency comparisons.</p>
<div className="flex items-center justify-between">
<div className="flex items-center">
<img
src={`https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20female%20tech%20professional%20with%20neutral%20background%2C%20clean%20portrait%20style%2C%20minimalist%20lighting&width=100&height=100&seq=author-tool${item}&orientation=squarish`}
alt="作者头像"
className="w-8 h-8 rounded-full mr-2"
/>
<span className="text-sm text-gray-700">李开发</span>
</div>
<div className="flex items-center space-x-3 text-gray-500 text-sm">
<span className="flex items-center"><i className="far fa-eye mr-1"></i> 2.5k</span>
<span className="flex items-center"><i className="far fa-comment mr-1"></i> 86</span>
</div>
</div>
</div>
</div>
))}
</div>
</div>
<div>
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl font-bold text-gray-900">Featured Developer Blogs</h2>
<a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
View All <i className="fas fa-chevron-right ml-1 text-sm"></i>
</a>
</div>
<div className="grid md:grid-cols-2 gap-6">
{[1, 2, 3].map((item) => (
<div key={`blog-${item}`} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
<div className="h-48 overflow-hidden">
<img
src={`https://readdy.ai/api/search-image?query=Developer%20writing%20code%20with%20AI%20assistance%2C%20showing%20split%20screen%20with%20terminal%20and%20code%20editor%2C%20modern%20workspace%20with%20blue%20accent%20lighting%2C%20professional%20tech%20environment&width=600&height=300&seq=blog${item}&orientation=landscape`}
alt="博客图片"
className="w-full h-full object-cover object-top"
/>
</div>
<div className="p-5">
<div className="flex items-center text-sm text-gray-500 mb-2">
<span>2025-07-0{item}</span>
<span className="mx-2">•</span>
<span>Dev Insights</span>
</div>
<h3 className="text-xl font-semibold mb-2 text-gray-900">Gemini CLI Plugin Development Guide: From Zero to Publication</h3>
<p className="text-gray-600 mb-4 line-clamp-2">A step-by-step guide on developing custom plugins for Gemini CLI, covering everything from environment setup and API integration to final publication, with complete code examples and common problem solutions.</p>
<div className="flex items-center justify-between">
<div className="flex items-center">
<img
src={`https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20male%20tech%20professional%20with%20glasses%2C%20neutral%20background%2C%20clean%20portrait%20style%2C%20minimalist%20lighting&width=100&height=100&seq=author-blog${item}&orientation=squarish`}
alt="作者头像"
className="w-8 h-8 rounded-full mr-2"
/>
<span className="text-sm text-gray-700">王程序</span>
</div>
<div className="flex items-center space-x-3 text-gray-500 text-sm">
<span className="flex items-center"><i className="far fa-eye mr-1"></i> 3.8k</span>
<span className="flex items-center"><i className="far fa-comment mr-1"></i> 124</span>
</div>
</div>
</div>
</div>
))}
</div>
</div>
</div>
{/* 侧边栏 */}
<div className="lg:w-1/4">
{/* 热门标签云 */}
<div className="bg-white rounded-xl shadow-sm p-6 mb-6">
<h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
<div className="flex flex-wrap gap-2">
{['Gemini CLI', 'AI Programming', 'Productivity Tools', 'Code Generation', 'Google', 'Command Line', 'Automation', 'Plugin Development', 'Tutorials', 'Best Practices'].map((tag, index) => (
<a
key={index}
href="#"
className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full hover:bg-blue-100 cursor-pointer whitespace-nowrap !rounded-button"
>
{tag}
</a>
))}
</div>
</div>
{/* 活跃用户排行 */}
<div className="bg-white rounded-xl shadow-sm p-6 mb-6">
<h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
<div className="space-y-4">
{[1, 2, 3, 4, 5].map((user) => (
<div key={`user-${user}`} className="flex items-center">
<div className="flex-shrink-0 mr-3 relative">
<img
src={`https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20with%20neutral%20background%2C%20diverse%20tech%20professional%2C%20clean%20minimalist%20style&width=100&height=100&seq=user${user}&orientation=squarish`}
alt="User Avatar"
className="w-10 h-10 rounded-full"
/>
<span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full">{user}</span>
</div>
<div>
<h4 className="text-sm font-medium text-gray-900">Tech Expert {user}</h4>
<p className="text-xs text-gray-500">{30 - user * 3} contributions</p>
</div>
</div>
))}
</div>
</div>
{/* 最新讨论话题 */}
<div className="bg-white rounded-xl shadow-sm p-6 mb-6">
<h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Discussions</h3>
<div className="space-y-4">
{[1, 2, 3, 4].map((topic) => (
<a key={`topic-${topic}`} href="#" className="block hover:bg-gray-50 -mx-3 px-3 py-2 rounded-lg">
<h4 className="text-sm font-medium text-gray-900 mb-1">Can Gemini CLI Completely Replace Traditional Code Editors?</h4>
<div className="flex items-center text-xs text-gray-500">
<span>42 replies</span>
<span className="mx-2">•</span>
<span>2 hours ago</span>
</div>
</a>
))}
</div>
</div>
{/* 社区公告板 */}
<div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-sm p-6">
<h3 className="text-lg font-semibold text-white mb-4">Community Announcements</h3>
<div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
<h4 className="text-sm font-medium text-white mb-2">Gemini CLI Online Sharing Session</h4>
<p className="text-xs text-blue-100 mb-3">Google engineers will share Gemini CLI's internal design philosophy and future plans</p>
<div className="flex items-center text-xs text-blue-200">
<i className="far fa-calendar mr-1"></i>
<span>July 15, 2025 20:00</span>
</div>
</div>
<button className="w-full py-2 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 cursor-pointer whitespace-nowrap !rounded-button">
View All Announcements
</button>
</div>
</div>
</div>
</main>
{/* 页脚 */}
<footer className="bg-gray-900 text-gray-300">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
<div>
<h3 className="text-xl font-bold text-white mb-4">Gemini CLI Hub</h3>
<p className="text-gray-400 mb-4">A dedicated platform for Google Gemini CLI product news, sharing, and developer community.</p>
<div className="flex space-x-4">
<a href="#" className="text-gray-400 hover:text-white">
<i className="fab fa-twitter text-xl"></i>
</a>
<a href="#" className="text-gray-400 hover:text-white">
<i className="fab fa-github text-xl"></i>
</a>
<a href="#" className="text-gray-400 hover:text-white">
<i className="fab fa-linkedin text-xl"></i>
</a>
<a href="#" className="text-gray-400 hover:text-white">
<i className="fab fa-youtube text-xl"></i>
</a>
</div>
</div>
<div>
<h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
<ul className="space-y-2">
<li><a href="#" className="text-gray-400 hover:text-white">News Center</a></li>
<li><a href="#" className="text-gray-400 hover:text-white">Tool Experience</a></li>
<li><a href="#" className="text-gray-400 hover:text-white">Developer Blog</a></li>
<li><a href="#" className="text-gray-400 hover:text-white">Community Discussion</a></li>
<li><a href="#" className="text-gray-400 hover:text-white">Event Calendar</a></li>
</ul>
</div>
<div>
<h4 className="text-lg font-semibold text-white mb-4">Support</h4>
<ul className="space-y-2">
<li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
<li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
<li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
<li><a href="#" className="text-gray-400 hover:text-white">Terms of Use</a></li>
<li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
</ul>
</div>
<div>
<h4 className="text-lg font-semibold text-white mb-4">Subscribe to Updates</h4>
<p className="text-gray-400 mb-4">Get the latest Gemini CLI news and tutorials</p>
<div className="flex">
<input
type="email"
placeholder="Your email address"
className="flex-1 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
<button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-r-md hover:bg-blue-700 cursor-pointer whitespace-nowrap !rounded-button">
Subscribe
</button>
</div>
</div>
</div>
<div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
<p className="text-gray-400 text-sm">© 2025 Gemini CLI Hub. All rights reserved.</p>
<div className="flex items-center space-x-4 mt-4 md:mt-0">
<div className="flex items-center text-gray-400">
<i className="fab fa-cc-visa text-xl mr-2"></i>
<i className="fab fa-cc-mastercard text-xl mr-2"></i>
<i className="fab fa-cc-paypal text-xl"></i>
</div>
</div>
</div>
</div>
</footer>
</div>
);
};
export default App