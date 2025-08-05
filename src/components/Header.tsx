// header.tsx
import { Link, useLocation } from 'react-router-dom';
import { Div, Text, Image, Button } from 'atomize';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { ConnectModal } from '@mysten/dapp-kit';
import { useSuiClient } from '@mysten/dapp-kit';
import { useState, useEffect } from 'react';

const Header = () => {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const location = useLocation();
  const client = useSuiClient();
  const [spotPrice, setSpotPrice] = useState(0);

  const truncatedAddress = account ? `${account.address.slice(0, 4)}...${account.address.slice(-3)}` : '';
  const isSwapPage = location.pathname === '/swap';

  useEffect(() => {
    const fetchSpotPrice = async () => {
      try {
        const poolId = '0x32d2bcdee9eefa4259b2d8a96f5960b483ef1afb9c82afe499da74d48db47d26';
        const obj = await client.getObject({
          id: poolId,
          options: { showContent: true },
        });

        const content = obj.data?.content;
        if (content && content.dataType === 'moveObject') {
          const fields = content.fields as any;
          const last_gold_price = Number(fields.last_gold_price);
          const exponent = Number(fields.last_exponent);
          const price = last_gold_price / Math.pow(10, exponent);
          setSpotPrice(price);
        }
      } catch (err) {
        console.error('Error fetching pool data:', err);
      }
    };

    fetchSpotPrice();
    const interval = setInterval(fetchSpotPrice, 30000); // Poll every 30 seconds for updates

    return () => clearInterval(interval);
  }, [client]);

  return (
    <Div
      d="flex"
      justify="space-between"
      align="center"
      p={{ x: { xs: '1rem', md: '4rem' }, y: { xs: '1rem', md: '2rem' } }}
      bg="white"
      borderBottom="1px solid #d1d5db"
      flexDir={{ xs: 'column', md: 'row' }}
    >
      {/* Row 1: Logo + Title */}
      <Div d="flex" align="center" m={{ b: { xs: '0.5rem', md: '0' } }} w={{ xs: '100%', md: 'auto' }} justify={{ xs: 'center', md: 'flex-start' }}>
        <Image src="/gldc.png" w={{ xs: '30px', md: '40px' }} h={{ xs: '30px', md: '40px' }} m={{ r: { xs: '0.5rem', md: '1rem' } }} bg="transparent" />
        <Div d="flex" align="baseline">
          <Text tag="h1" textSize={{ xs: 'title', md: 'display1' }} textColor="#111827" m="0" style={{ fontFamily: 'DM Sans, sans-serif' }}>GLDC</Text>
          {isSwapPage && <Text tag="h1" textSize={{ xs: 'title', md: 'display1' }} textColor="#111827" m={{ l: { xs: '0.5rem', md: '0.75rem' } }} style={{ fontFamily: 'DM Sans, sans-serif', fontStyle: 'italic' }}>Testnet Vault</Text>}
        </Div>
      </Div>
      {/* Row 2 (mobile) / Integrated with Row 3 (desktop): Prices + Nav + Wallet */}
      <Div 
        d="flex" 
        align="baseline" 
        flexDir={{ xs: 'column', md: 'row' }} 
        justify={{ xs: 'center', md: 'space-between' }} 
        w={{ xs: '100%', md: 'auto' }} 
        flexWrap={{ xs: 'wrap', md: 'nowrap' }}
      >
        {/* Prices Section - Left-aligned on desktop, centered on mobile */}
        <Div 
          d="flex" 
          align="baseline" 
          m={{ b: { xs: '0.5rem', md: '0' }, r: { md: '2rem' } }} 
          flexWrap="wrap" 
          justify={{ xs: 'center', md: 'flex-start' }}
          textAlign={{ xs: 'center', md: 'left' }}
          w={{ xs: '100%', md: 'auto' }}
        >
          <a href={`https://testnet.suivision.xyz/object/0x32d2bcdee9eefa4259b2d8a96f5960b483ef1afb9c82afe499da74d48db47d26`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Div d="flex" align="baseline" m={{ r: { xs: '1rem', md: '1.5rem' } }}>
              <Text textSize={{ xs: 'caption', md: 'body' }} textColor="#111827" textWeight="600">
                1oz Gold Spot Price:&nbsp;$ {/* Space with &nbsp; */}
              </Text>
              <Text textSize={{ xs: 'caption', md: 'body' }} textColor="#111827" textWeight="400">
                {spotPrice.toFixed(2)}
              </Text>
            </Div>
          </a>
          <Div d="flex" align="baseline">
            <Text textSize={{ xs: 'caption', md: 'body' }} textColor="#111827" textWeight="600">
              1 GLDC:&nbsp;$ {/* Space with &nbsp; */}
            </Text>
            <Text textSize={{ xs: 'caption', md: 'body' }} textColor="#111827" textWeight="400">
              {(spotPrice / 1000).toFixed(2)}
            </Text>
          </Div>
        </Div>
        {/* Nav Links + Wallet - Right-aligned on desktop, centered on mobile */}
        <Div 
          d="flex" 
          align="baseline" 
          flexWrap="wrap" 
          justify={{ xs: 'center', md: 'flex-end' }}
          textAlign={{ xs: 'center', md: 'right' }}
          w={{ xs: '100%', md: 'auto' }}
        >
          <Link to="/">
            <Text textSize={{ xs: 'title', md: 'title' }} textColor="#111827" hoverTextColor="#3b82f6" transition m={{ r: { xs: '1rem', md: '2rem' }, b: { xs: '0.5rem', md: '0' } }}>Home</Text>
          </Link>
          <Link to="/swap">
            <Text textSize={{ xs: 'title', md: 'title' }} textColor="#111827" hoverTextColor="#3b82f6" transition m={{ r: { xs: '1rem', md: '2rem' }, b: { xs: '0.5rem', md: '0' } }}>Swap</Text>
          </Link>
          <Link to="/faucet">
            <Text textSize={{ xs: 'title', md: 'title' }} textColor="#111827" hoverTextColor="#3b82f6" transition m={{ r: { xs: '1rem', md: '2rem' }, b: { xs: '0.5rem', md: '0' } }}>Faucet</Text>
          </Link>
          <Link to="/testnet-tasks">
            <Text textSize={{ xs: 'title', md: 'title' }} textColor="#111827" hoverTextColor="#3b82f6" transition m={{ r: { xs: '1rem', md: '2rem' }, b: { xs: '0.5rem', md: '0' } }}>Testnet</Text>
          </Link>
          {account ? (
            <Button
              onClick={disconnect}
              bg="#60a5fa"
              textColor="white"
              p={{ x: { xs: '0.5rem', md: '1rem' }, y: { xs: '0.25rem', md: '0.25rem' } }}
              rounded="md"
              textSize={{ xs: 'body', md: 'body' }}
              w={{ xs: '100%', md: 'auto' }}
              minH={{ xs: '36px', md: 'auto' }}
              m={{ t: { xs: '0.5rem', md: '0' } }}
            >
              {truncatedAddress} Disconnect
            </Button>
          ) : (
            <ConnectModal
              trigger={
                <Button
                  bg="#60a5fa"
                  textColor="white"
                  p={{ x: { xs: '0.5rem', md: '1rem' }, y: { xs: '0.25rem', md: '0.25rem' } }}
                  rounded="md"
                  textSize={{ xs: 'body', md: 'body' }}
                  w={{ xs: '100%', md: 'auto' }}
                  minH={{ xs: '36px', md: 'auto' }}
                  m={{ t: { xs: '0.5rem', md: '0' } }}
                >
                  Connect Wallet
                </Button>
              }
            />
          )}
        </Div>
      </Div>
    </Div>
  );
};

export default Header;