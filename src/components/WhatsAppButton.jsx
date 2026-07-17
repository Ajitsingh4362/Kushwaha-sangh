import { MessageCircle } from 'lucide-react'
import { site } from '../data/content'

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-saffron"
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} />
    </a>
  )
}
