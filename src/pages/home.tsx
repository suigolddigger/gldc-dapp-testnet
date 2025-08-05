// home.tsx (updated: removed autoplay=1 from iframe src to prevent automatic playback; users must click play; no other changes)
import { Div, Text, Image, Button } from 'atomize';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const Home = () => {
  const [showText, setShowText] = useState(true);
  const wrapper1Ref = useRef<HTMLDivElement>(null);
  const wrapper2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowText((prev) => !prev);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Initial reset: Set the starting hidden wrapper to -100% instantly
  useEffect(() => {
    if (showText && wrapper2Ref.current) {
      wrapper2Ref.current.style.transform = 'translateX(-100%)';
    } else if (!showText && wrapper1Ref.current) {
      wrapper1Ref.current.style.transform = 'translateX(-100%)';
    }
  }, []);

  // After each toggle, wait for transition to end, then reset hidden wrapper to -100% instantly
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showText && wrapper2Ref.current) {
        wrapper2Ref.current.style.transition = 'none';
        wrapper2Ref.current.style.transform = 'translateX(-100%)';
        wrapper2Ref.current.style.transition = 'transform 2s ease-in-out, opacity 2s ease-in-out';
      } else if (!showText && wrapper1Ref.current) {
        wrapper1Ref.current.style.transition = 'none';
        wrapper1Ref.current.style.transform = 'translateX(-100%)';
        wrapper1Ref.current.style.transition = 'transform 2s ease-in-out, opacity 2s ease-in-out';
      }
    }, 2100);
    return () => clearTimeout(timeout);
  }, [showText]);

  return (
    <Div bg="white" p={{ x: { xs: '1rem', md: '2rem' }, y: { xs: '2rem', md: '4rem' } }}>
      {/* Hero Section: Background image, bold statements, side-by-side image without overflow */}
      <Div
        d="flex"
        flexDir={{ xs: 'column', md: 'row' }}
        align="center"
        justify="space-between"
        style={{
          backgroundImage: `url('/Backgroundgldc.avif')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        p={{ xs: '2rem', md: '4rem' }}
        rounded="xl"
        shadow="3"
        m={{ b: { xs: '6rem', md: '12rem' } }}
      >
        <Div w={{ xs: '100%', md: '50%' }} p={{ r: { md: '2rem' } }}>
          <Text tag="h1" textSize={{ xs: 'display2', md: 'display3' }} textColor="#111827" m={{ b: '1rem' }} textWeight="700">
            Revolutionize Gold Ownership
          </Text>
          {/* Animated subtitle with slower sliding banner effect and fade */}
          <Div pos="relative" h={{ xs: '4rem', md: '3rem' }} m={{ b: '2rem' }} overflow="hidden">
            <Div
              ref={wrapper1Ref}
              pos="absolute"
              top="0"
              left="0"
              w="100%"
              style={{
                transform: showText ? 'translateX(0%)' : 'translateX(100%)',
                opacity: showText ? 1 : 0,
                transition: 'transform 2s ease-in-out, opacity 2s ease-in-out',
              }}
            >
              <Div d="flex" flexDir={{ xs: 'column', md: 'row' }} align={{ xs: 'flex-start', md: 'flex-start' }} m="0" textAlign={{ xs: 'left', md: 'left' }}>
                <Text
                  textSize={{ xs: 'subheader', md: 'title' }}
                  textColor="#6b7280"
                  m={{ b: { xs: '0', md: '0' } }}
                >
                  GLDC is fractional gold on chain,
                </Text>
                <Text
                  textSize={{ xs: 'subheader', md: 'title' }}
                  textColor="#6b7280"
                  m={{ l: { md: '0.25rem' }, t: { xs: '0', md: '0' } }}
                >
                  built for Sui network.
                </Text>
              </Div>
            </Div>
            <Div
              ref={wrapper2Ref}
              pos="absolute"
              top="0"
              left="0"
              w="100%"
              style={{
                transform: showText ? 'translateX(100%)' : 'translateX(0%)',
                opacity: showText ? 0 : 1,
                transition: 'transform 2s ease-in-out, opacity 2s ease-in-out',
              }}
            >
              <Div 
                d="flex" 
                flexDir={{ xs: 'column', md: 'row' }} 
                align={{ xs: 'flex-start', md: 'flex-start' }} 
                textAlign={{ xs: 'left', md: 'left' }}
                m="0"
              >
                <Div d="flex" align="center" justify={{ xs: 'flex-start', md: 'flex-start' }} m={{ b: { xs: '0', md: '0' } }}>
                  <Image src="/gldc.png" w="auto" h={{ xs: '1em', md: '1.3em' }} m={{ r: '0.25rem' }} />
                  <Text
                    textSize={{ xs: 'subheader', md: 'title' }}
                    textColor="#6b7280"
                  >
                    is fractional gold on chain,
                  </Text>
                </Div>
                <Div d="flex" align="center" justify={{ xs: 'flex-start', md: 'flex-start' }} m={{ t: { xs: '0', md: '0' }, l: { md: '0.25rem' } }}>
                  <Text
                    textSize={{ xs: 'subheader', md: 'title' }}
                    textColor="#6b7280"
                    m={{ r: '0.25rem' }}
                  >
                    built for
                  </Text>
                  <Image src="/suilogo.png" w="auto" h={{ xs: '1em', md: '1.3em' }} m={{ r: '0.25rem' }} />
                  <Text
                    textSize={{ xs: 'subheader', md: 'title' }}
                    textColor="#6b7280"
                  >
                    network.
                  </Text>
                </Div>
              </Div>
            </Div>
          </Div>
          <Link to="/testnet-tasks">
            <Button bg="#60a5fa" textColor="#ffffff" p={{ x: { xs: '1rem', md: '2rem' }, y: '1rem' }} rounded="lg" shadow="3" hoverShadow="4" transition w={{ xs: '100%', md: 'auto' }} minH="44px">
              Start Now
            </Button>
          </Link>
        </Div>
        <Div w={{ xs: '100%', md: '50%' }} m={{ t: { xs: '2rem', md: '0' } }} d="flex" justify="center">
          <Image src="/Pamp.jpeg" w={{ xs: '80%', md: '100%' }} h="auto" rounded="lg" shadow="2" maxW={{ xs: '300px', md: 'none' }} />
        </Div>
      </Div>

      {/* Embedded YouTube Video: Responsive, centered, seamless playback with sound enabled, full controls (progress bar, volume, etc.), minimal branding */}
      <Div d="flex" justify="center" m={{ b: { xs: '2rem', md: '4rem' } }}>
        <Div pos="relative" w={{ xs: '100%', md: '70%' }} style={{ aspectRatio: '16 / 9' }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0 }}
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/S-6WNmL26wE?controls=1&rel=0&modestbranding=1&showinfo=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </Div>
      </Div>
    </Div>
  );
};

export default Home;