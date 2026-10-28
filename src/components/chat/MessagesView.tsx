import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MessageSquare,
  ShieldAlert,
  DollarSign,
  Check,
  CheckCheck,
  X,
  MapPin,
  Clock,
  ArrowLeft,
  Phone,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MessagesView: React.FC = () => {
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    currentUser,
    listings,
    sendMessage,
    respondToOffer,
    setActiveListingId,
    setActiveView,
    showToast,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [offerInput, setOfferInput] = useState('');
  const [showOfferBox, setShowOfferBox] = useState(false);
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active conversation
  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const convMessages = messages.filter((m) => m.conversationId === activeConv?.id);
  const activeListing = listings.find((l) => l.id === activeConv?.listingId);

  // Auto-scroll to bottom of conversation thread
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMessages.length, activeConv?.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(offerInput.replace(/[^0-9]/g, ''));
    if (!num || num <= 0 || !activeConv) return;
    sendMessage(activeConv.id, `I would like to make an offer of KES ${num.toLocaleString()}`, true, num);
    setOfferInput('');
    setShowOfferBox(false);
    showToast(`Offer of KES ${num.toLocaleString()} submitted`, 'success');
  };

  const handleWhatsAppClick = () => {
    if (!activeListing?.sellerPhone) return;
    const phoneClean = activeListing.sellerPhone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${activeListing.sellerName}, I am contacting you regarding your listing "${activeListing.title}" on adBay Kenya.`
    );
    window.open(`https://wa.me/${phoneClean}?text=${text}`, '_blank');
  };

  const quickReplies = [
    'Is this item still available?',
    'What is your lowest price?',
    'Can we meet in Westlands today?',
    'Do you provide delivery in Nairobi?',
    'Can I inspect it before payment?',
  ];

  return (
    <div className="max-w-[1250px] mx-auto px-2 sm:px-3 py-3">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('home')}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 md:hidden"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#00A859]" />
            <h2 className="font-bold text-[15px] md:text-[16px] text-gray-900 dark:text-white">
              adBay In-Platform Messages
            </h2>
          </div>
        </div>

        <span className="text-[11px] text-gray-500">
          Signed in as: <strong className="text-gray-800 dark:text-gray-200">{currentUser?.name || 'Guest User'}</strong>
        </span>
      </div>

      {/* Main 2-Panel Layout */}
      <div className="border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-[#131c31] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] shadow-sm">
        {/* Conversations List Panel (Hidden on mobile if viewing active thread) */}
        <div
          className={`md:col-span-4 border-r border-gray-100 dark:border-gray-800 flex flex-col ${
            mobileThreadOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 font-semibold text-[12px] text-gray-700 dark:text-gray-300 flex items-center justify-between">
            <span>Conversations Inbox ({conversations.length})</span>
            <span className="text-[10px] text-gray-400">Direct Chat</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-[12px] space-y-1">
                <MessageSquare className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600" />
                <p className="font-medium text-gray-600 dark:text-gray-300">No active conversations</p>
                <p className="text-[11px]">Click "Chat with Seller" on any ad to inquire directly.</p>
              </div>
            ) : (
              conversations.map((c) => {
                const isSelected = activeConv?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveConversationId(c.id);
                      setMobileThreadOpen(true);
                    }}
                    className={`w-full text-left p-2.5 flex items-start gap-2 transition ${
                      isSelected
                        ? 'bg-[#00A859]/10 border-l-3 border-[#00A859]'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <img
                      src={c.listingImage || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=150'}
                      alt={c.listingTitle}
                      className="w-12 h-12 rounded object-cover shrink-0 bg-gray-200"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-[12px] text-gray-900 dark:text-white truncate">
                          {c.sellerId === currentUser?.id ? c.buyerName : c.sellerName}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 truncate">
                        {c.listingTitle} (KES {c.listingPrice.toLocaleString()})
                      </p>

                      <p className="text-[11px] md:text-[12px] text-gray-500 truncate mt-0.5">
                        {c.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Active Thread Panel (Hidden on mobile if inbox list is shown) */}
        <div
          className={`md:col-span-8 flex flex-col justify-between bg-gray-50/30 dark:bg-gray-900/20 ${
            !mobileThreadOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConv ? (
            <>
              {/* Thread Header with Listing Details & Actions */}
              <div className="p-2.5 bg-white dark:bg-[#131c31] border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Mobile Back Button to return to inbox */}
                  <button
                    onClick={() => setMobileThreadOpen(false)}
                    className="md:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-1 text-[11px] font-semibold text-[#00A859]"
                    aria-label="Back to inbox"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Inbox</span>
                  </button>

                  <img
                    src={activeConv.listingImage}
                    alt={activeConv.listingTitle}
                    className="w-10 h-10 rounded object-cover bg-gray-100 shrink-0 cursor-pointer"
                    onClick={() => {
                      setActiveListingId(activeConv.listingId);
                    }}
                  />
                  <div className="min-w-0">
                    <button
                      onClick={() => {
                        setActiveListingId(activeConv.listingId);
                      }}
                      className="text-left font-bold text-[12px] md:text-[13px] text-gray-900 dark:text-white truncate block hover:text-[#00A859] flex items-center gap-1"
                      title="View listing details"
                    >
                      <span className="truncate">{activeConv.listingTitle}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 text-gray-400" />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-[#00A859] font-normal text-[12px]">
                        KES {activeConv.listingPrice.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-gray-400 truncate">
                        • with {activeConv.sellerId === currentUser?.id ? activeConv.buyerName : activeConv.sellerName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Header Actions: Call, WhatsApp, Offer */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {activeListing?.sellerPhone && (
                    <>
                      <a
                        href={`tel:${activeListing.sellerPhone}`}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-[11px] font-medium flex items-center gap-1 transition"
                        title={`Call ${activeConv.sellerName}`}
                      >
                        <Phone className="w-3 h-3 text-[#00A859]" />
                        <span className="hidden sm:inline">Call</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleWhatsAppClick}
                        className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-[#00A859] rounded text-[11px] font-medium flex items-center gap-1 transition border border-[#00A859]/30"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setShowOfferBox(!showOfferBox)}
                    className="px-2.5 py-1 bg-[#F59E0B] hover:bg-[#d97706] text-gray-950 rounded text-[11px] font-bold flex items-center gap-1 transition"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Make Offer</span>
                  </button>
                </div>
              </div>

              {/* Safety notice in chat thread */}
              <div className="px-3 py-1 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Safety Rule: Never pay in advance. Inspect goods in a public place before paying via M-Pesa.</span>
              </div>

              {/* Offer Drawer if open */}
              {showOfferBox && (
                <form
                  onSubmit={handleSendOffer}
                  className="p-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2"
                >
                  <span className="text-[12px] font-bold text-gray-800 dark:text-gray-200">
                    Offer (KES):
                  </span>
                  <input
                    type="number"
                    placeholder="e.g. 140000"
                    value={offerInput}
                    onChange={(e) => setOfferInput(e.target.value)}
                    className="px-2 py-1 rounded border border-gray-300 bg-white dark:bg-gray-800 text-[12px] w-36"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#00A859] text-white rounded text-[12px] font-bold"
                  >
                    Send Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOfferBox(false)}
                    className="text-gray-500 text-[12px]"
                  >
                    Cancel
                  </button>
                </form>
              )}

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {convMessages.map((m) => {
                  const isMe = m.senderId === currentUser?.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-gray-400 mb-0.5 px-1">{m.senderName}</span>

                      {/* Regular message or Offer card */}
                      {m.isOffer ? (
                        <div className="border border-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded p-2.5 max-w-sm text-[12px] md:text-[13px] shadow-xs">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                            <DollarSign className="w-4 h-4 text-[#00A859]" />
                            <span>Formal Offer: KES {m.offerAmount?.toLocaleString()}</span>
                          </div>
                          <p className="mt-1 text-gray-700 dark:text-gray-300 text-[12px]">{m.text}</p>

                          {/* Offer Status */}
                          <div className="mt-2 pt-1 border-t border-amber-200 dark:border-amber-800 flex items-center justify-between">
                            <span className="text-[10px] md:text-[11px] font-semibold uppercase text-gray-500">
                              Status: {m.offerStatus || 'pending'}
                            </span>

                            {/* Seller Action Buttons if pending */}
                            {!isMe && m.offerStatus === 'pending' && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => respondToOffer(m.id, 'accepted')}
                                  className="px-2 py-0.5 rounded bg-[#00A859] text-white text-[11px] font-bold hover:bg-[#00924c]"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => respondToOffer(m.id, 'declined')}
                                  className="px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-bold hover:bg-red-700"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`rounded px-3 py-1.5 max-w-[85%] sm:max-w-[80%] text-[12px] md:text-[13px] leading-relaxed shadow-xs ${
                            isMe
                              ? 'bg-[#00A859] text-white rounded-br-xs'
                              : 'bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-xs'
                          }`}
                        >
                          <p>{m.text}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-0.5 text-[9px] ${
                              isMe ? 'text-emerald-100' : 'text-gray-400'
                            }`}
                          >
                            <span>
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && (
                              <span title="Delivered" className="inline-flex items-center">
                                <CheckCheck className="w-3 h-3 text-white" />
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies chips */}
              <div className="px-3 py-1 bg-white dark:bg-[#131c31] border-t border-gray-100 dark:border-gray-800 flex gap-1 overflow-x-auto text-[11px]">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(activeConv.id, reply)}
                    className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#00A859]/10 hover:text-[#00A859] whitespace-nowrap shrink-0 transition"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSend}
                className="p-2 bg-white dark:bg-[#131c31] border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5"
              >
                <input
                  type="text"
                  placeholder="Type your message to seller..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px] md:text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-3 py-1.5 rounded bg-[#00A859] hover:bg-[#00924c] disabled:opacity-40 text-white font-medium text-[12px] md:text-[13px] flex items-center gap-1 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-[13px] p-6 text-center">
              Select a conversation from the left to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
