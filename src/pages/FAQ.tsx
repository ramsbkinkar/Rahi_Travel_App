
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ: React.FC = () => {
  const faqItems = [
    {
      question: "What is Raahi?",
      answer: "Raahi is your smart travel companion that helps you plan, capture, and remember your journeys across India. Our platform offers curated travel packages, city guides, digital scrapbooking, social sharing, and live trip tracking to enhance your travel experience."
    },
    {
      question: "How do I create a digital scrapbook?",
      answer: "To create a digital scrapbook, simply navigate to the 'Scrapbook' section, select a theme that matches your trip (Friends, Love, Beach, etc.), then upload your photos, add captions, customize with stickers, and arrange your layout. You can add multiple pages and switch between different themes anytime."
    },
    {
      question: "Can I book travel packages directly through Raahi?",
      answer: "Yes! You can browse our curated travel packages and book them directly through our platform. We offer a variety of options including Honeymoon, Adventure, Spiritual, Friends, and Family packages across different destinations in India. Each package includes accommodations, activities, and transportation details."
    },
    {
      question: "How does the Trip Tracker feature work?",
      answer: "Trip Tracker allows you to share your real-time location with friends and family during your travels. Simply enable location sharing in the Trip Tracker section, and invite your travel companions or loved ones to view your journey. They'll be able to see your location on a map of India along with other travelers in your group."
    },
    {
      question: "Is my personal information secure on Raahi?",
      answer: "Absolutely. At Raahi, we take your privacy and data security very seriously. We use industry-standard encryption protocols to protect your personal information, and we never share your data with third parties without your explicit consent. You can review our detailed privacy policy for more information."
    },
    {
      question: "How can I share my travel experiences on the Travelgram feed?",
      answer: "To share your travel experiences, go to the 'Travelgram' section and click on 'New Post'. You can upload photos, add a location, include hashtags, and write a caption about your adventure. Your post will appear in the feed and other travelers can like, comment, and engage with your content."
    },
    {
      question: "What information is available in the Explore India city guides?",
      answer: "Our Explore India city guides provide comprehensive information about various Indian cities, including: Airport Info, Railway Stations, Local Food, Places to Visit, Budget Accommodations, Luxury Stays, Local Culture, Emergency Numbers, Best Times to Visit, and Local Transportation options. Each guide is designed to give you the essential information you need for an enjoyable visit."
    },
    {
      question: "Can I use Raahi offline during my travels?",
      answer: "Some features of Raahi are available offline if you download the necessary information before going offline. City guides can be downloaded for offline use, and you can continue building your digital scrapbook without an internet connection. However, features like Trip Tracker and Travelgram require an internet connection to function properly."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our customer support team in several ways: through the 'Contact Us' form on our website, by emailing support@raahi.travel, or by calling our customer service hotline at +91-XXX-XXX-XXXX. Our support team is available 7 days a week from 9 AM to 9 PM IST."
    },
    {
      question: "Is Raahi available as a mobile app?",
      answer: "Yes! Raahi is available as a mobile app on both iOS and Android platforms. You can download it from the Apple App Store or Google Play Store. The mobile app offers all the features of the web version, plus additional functionality like offline access to saved content and push notifications for trip updates."
    }
  ];

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Header Section */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-raahi-blue-light to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions about Raahi and your travel journey.
            </p>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our support team is here to help with any additional questions you may have.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-raahi-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-raahi-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">Send us a message and we'll get back to you.</p>
                <a href="mailto:support@raahi.travel" className="text-raahi-blue font-medium">support@raahi.travel</a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-raahi-orange-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-raahi-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-4">Available 7 days a week, 9am-9pm IST</p>
                <a href="tel:+910000000000" className="text-raahi-blue font-medium">+91 000 000 0000</a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Chat with our team for immediate help</p>
                <button className="text-raahi-blue font-medium">Start Chat</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default FAQ;
