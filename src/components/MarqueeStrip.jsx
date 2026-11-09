const lines = [
  'एकता और संगठन ही हमारी शक्ति है',
  'साथ मिलकर आगे बढ़ें, साथ मिलकर सेवा करें',
  'आज की शिक्षा, कल का सशक्तिकरण',
  'देने से कोई कभी गरीब नहीं हुआ',
  'हर सदस्य महत्वपूर्ण है, हर आवाज़ की कद्र है',
  'छोटा योगदान, स्थायी बदलाव',
  'समाज सबसे पहले, हमेशा',
  'ऐसा भविष्य बनाएँ जिस पर हमारे बच्चे गर्व करें',
]

export default function MarqueeStrip() {
  const track = [...lines, ...lines]

  return (
    <div className="overflow-hidden border-y border-gold/30 bg-maroon-deep py-3">
      <div className="flex w-max animate-[scroll-x_32s_linear_infinite] items-center gap-10">
        {track.map((line, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-sm tracking-wide text-cream-paper sm:text-base">
            {line}
            <span className="text-gold" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
