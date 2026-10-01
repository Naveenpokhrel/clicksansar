import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiVideo, 
  FiEdit3, 
  FiCode 
} from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { SiMeta } from 'react-icons/si';

// Dedicated Outlets
import MetaAdsOutlet from './MetaAdsOutlet';
import VideoShootOutlet from './VideoShootOutlet';
import ContentCreationOutlet from './ContentCreationOutlet';
import SubscriptionsOutlet from './SubscriptionsOutlet';
import WebDevOutlet from './WebDevOutlet';

const servicesNav = [
  {
    id: 'meta-ads',
    label: 'Meta Ads & Boosting',
    icon: <SiMeta />,
    activeColor: 'bg-blue-600 text-white',
  },
  {
    id: 'video-shoot',
    label: 'Video Shoot & Editing',
    icon: <FiVideo />,
    activeColor: 'bg-rose-500 text-white',
  },
  {
    id: 'content-creation',
    label: 'Content Creation',
    icon: <FiEdit3 />,
    activeColor: 'bg-emerald-600 text-white',
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: <FaCrown />,
    activeColor: 'bg-purple-600 text-white',
  },
  {
    id: 'web-dev',
    label: 'Website & App',
    icon: <FiCode />,
    activeColor: 'bg-orange-500 text-white',
  },
];

const Services = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // Scroll to top when service outlet changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [serviceId]);

  // Current active outlet (defaults to 'meta-ads' if /services is visited directly)
  const activeService = serviceId || 'meta-ads';

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Service Switcher Tabs */}
        <div className="pt-2 pb-6 border-b border-slate-100 mb-8 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max">
            {servicesNav.map((item) => {
              const isActive = activeService === item.id;
              return (
                <Link
                  key={item.id}
                  to={`/services/${item.id}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? `${item.activeColor} shadow-sm scale-102`
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dynamic Outlet Rendering */}
        <main className="animate-fadeIn">
          {activeService === 'meta-ads' && (
            <MetaAdsOutlet onBack={handleBack} />
          )}

          {activeService === 'video-shoot' && (
            <VideoShootOutlet onBack={handleBack} />
          )}

          {activeService === 'content-creation' && (
            <ContentCreationOutlet onBack={handleBack} />
          )}

          {activeService === 'subscriptions' && (
            <SubscriptionsOutlet onBack={handleBack} />
          )}

          {activeService === 'web-dev' && (
            <WebDevOutlet onBack={handleBack} />
          )}

          {/* Fallback for unknown serviceId */}
          {!['meta-ads', 'video-shoot', 'content-creation', 'subscriptions', 'web-dev'].includes(activeService) && (
            <MetaAdsOutlet onBack={handleBack} />
          )}
        </main>

      </div>
    </div>
  );
};

export default Services;
