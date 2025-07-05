"use client";

import { useState } from "react";
import { Footer as FooterType } from "@/types/blocks/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/icon";
import { useTranslations } from "next-intl";

export default function Footer({ footer }: { footer: FooterType }) {
  const t = useTranslations("stats");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  
  if (footer.disabled) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: Implement actual subscription logic
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company Info */}
          <div>
            <div className="flex items-center mb-4">
              {footer.brand?.logo && (
                <img
                  src={footer.brand.logo.src}
                  alt={footer.brand.logo.alt || footer.brand.title}
                  className="h-8 w-8 mr-3"
                />
              )}
              <h3 className="text-xl font-bold text-white">
                {footer.brand?.title || "Gemini CLI Hub"}
              </h3>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              {footer.brand?.description || "A dedicated platform for Google Gemini CLI product news, sharing, and developer community."}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Icon name="RiTwitterXLine" className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Icon name="RiGithubLine" className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Icon name="RiLinkedinLine" className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Icon name="RiYoutubeLine" className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/news" className="text-gray-400 hover:text-white transition-colors duration-200">
                  News Center
                </a>
              </li>
              <li>
                <a href="/tools" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Tool Experience
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Developer Blog
                </a>
              </li>
              <li>
                <a href="/community" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Community Discussion
                </a>
              </li>
              <li>
                <a href="/showcase" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Showcase
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="/help" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="/api" className="text-gray-400 hover:text-white transition-colors duration-200">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Subscribe to Updates</h4>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Get the latest Gemini CLI news and tutorials delivered to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                disabled={subscribed}
              >
                {subscribed ? (
                  <>
                    <Icon name="RiCheckLine" className="mr-2 h-4 w-4" />
                    Subscribed!
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>

            {/* Additional Info */}
            <div className="mt-4 text-xs text-gray-500">
              <p>• Weekly newsletter with curated content</p>
              <p>• Early access to new features</p>
              <p>• Unsubscribe anytime</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright and Stats */}
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm mb-2">
                {footer.copyright || "© 2025 Gemini CLI Hub. All rights reserved."}
                {process.env.NEXT_PUBLIC_SHOW_POWERED_BY === "false" ? null : (
                  <a
                    href="https://shipany.ai"
                    target="_blank"
                    className="ml-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Built with ShipAny
                  </a>
                )}
              </p>
              
              {/* Site Statistics */}
              <div className="flex flex-col sm:flex-row gap-4 text-xs text-gray-500">
                <span id="busuanzi_container_site_pv" className="flex items-center">
                  <Icon name="RiEyeLine" className="mr-1 h-3 w-3" />
                  {t('totalViews')} <span id="busuanzi_value_site_pv" className="mx-1 font-semibold"></span> {t('viewsUnit')}
                </span>
                <span id="busuanzi_container_site_uv" className="flex items-center">
                  <Icon name="RiUserLine" className="mr-1 h-3 w-3" />
                  {t('totalVisitors')} <span id="busuanzi_value_site_uv" className="mx-1 font-semibold"></span> {t('visitorsUnit')}
                </span>
              </div>
            </div>

            {/* Payment Methods & Additional Links */}
            <div className="flex flex-col items-center lg:items-end space-y-3">
              {/* Legal Links */}
              {footer.agreement && (
                <ul className="flex flex-wrap justify-center lg:justify-end gap-4 text-sm">
                  {footer.agreement.items?.map((item, i) => (
                    <li key={i}>
                      <a 
                        href={item.url} 
                        target={item.target}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {/* Payment Methods */}
              <div className="flex items-center space-x-3 text-gray-400">
                <span className="text-xs">Secured payments by:</span>
                <div className="flex items-center space-x-2">
                  <Icon name="RiVisaLine" className="h-5 w-5" />
                  <Icon name="RiMastercardLine" className="h-5 w-5" />
                  <Icon name="RiPaypalLine" className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="mt-8 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Made with</span>
                <Icon name="RiHeartLine" className="h-3 w-3 text-red-500" />
                <span>for the developer community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
