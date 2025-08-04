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
    <Div d="flex" justify="space-between" align="center" p={{ x: '4rem', y: '2rem' }} bg="white" borderBottom="1px solid #d1d5db">
      <Div d="flex" align="center">
        <Image src="/gldc.png" w="40px" h="40px" m={{ r: '1rem' }} bg="transparent" />
        <Div d="flex" align="baseline">
          <Text tag="h1" textSize="display1" textColor="#111827" m="0" style={{ fontFamily: 'DM Sans, sans-serif' }}>GLDC</Text>
          {isSwapPage && <Text tag="h1" textSize="display1" textColor="#111827" m={{ l: '0.75rem' }} style={{ fontFamily: 'DM Sans, sans-serif', fontStyle: 'italic' }}>Testnet Vault</Text>}
        </Div>
      </Div>
      <Div d="flex" align="baseline">
        <a href={`https://testnet.suivision.xyz/object/0x32d2bcdee9eefa4259b2d8a96f5960b483ef1afb9c82afe499da74d48db47d26`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <Div d="flex" m={{ r: '2.5rem' }}>
            <Text textSize="body" textColor="#111827" textWeight="600">
              Gold Spot Price: {' '}
            </Text>
            <Text textSize="body" textColor="#111827" textWeight="400">
              ${spotPrice.toFixed(2)}
            </Text>
          </Div>
        </a>
        <Link to="/">
          <Text textSize="title" textColor="#111827" hoverTextColor="#3b82f6" transition m={{ r: '2rem' }}>Home</Text>
        </Link>
        <Link to="/swap">
          <Text textSize="title" textColor="#111827" hoverTextColor="#3b82f6" transition m={{ r: '2rem' }}>Swap</Text>
        </Link>
        <Link to="/faucet">
          <Text textSize="title" textColor="#111827" hoverTextColor="#3b82f6" transition m={{ r: '2rem' }}>Faucet</Text>
        </Link>
        <Link to="/testnet-tasks"> {/* Added Testnet link */}
          <Text textSize="title" textColor="#111827" hoverTextColor="#3b82f6" transition m={{ r: '2rem' }}>Testnet</Text>
        </Link>
        {account ? (
          <Button
            onClick={disconnect}
            bg="#60a5fa"
            textColor="white"
            p={{ x: '1rem', y: '0.25rem' }}
            rounded="md"
            textSize="body"
          >
            {truncatedAddress} Disconnect
          </Button>
        ) : (
          <ConnectModal
            trigger={
              <Button
                bg="#60a5fa"
                textColor="white"
                p={{ x: '1rem', y: '0.25rem' }}
                rounded="md"
                textSize="body"
              >
                Connect Wallet
              </Button>
            }
          />
        )}
      </Div>
    </Div>
  );
};

export default Header;