import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { ConnectModal } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { isValidSuiAddress } from '@mysten/sui/utils';
import { Div, Button, Text, Image, Input } from 'atomize';
import { ConnectButton } from '@mysten/dapp-kit';

const PACKAGE_ID = '0x5e34aef344d01b4b21408f92fac7dca814297b9b20c78e615f333bc16f8e454d'; // Your new package ID
const FAUCET_ID = '0x5321706db66c681539977d4e26c8677ad5acfaa28387fac908f8b83cce8fc20d'; // Your new faucet object ID
const CLOCK_ID = '0x6';
const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000;

const FaucetPage = () => {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState(account?.address || '');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setRecipient(account?.address || '');
  }, [account]);

  const checkCanClaim = async (addr: string) => {
    if (!isValidSuiAddress(addr)) {
      throw new Error('Invalid Sui address');
    }

    // Get current timestamp from clock
    const clockResp = await client.getObject({
      id: CLOCK_ID,
      options: { showContent: true },
    });
    const now = parseInt((clockResp.data?.content as any).fields.timestamp_ms, 10);

    // Get faucet object to find table ID
    const faucetResp = await client.getObject({
      id: FAUCET_ID,
      options: { showContent: true },
    });
    const tableId = (faucetResp.data?.content as any).fields.last_claims.fields.id.id;

    // Get last claim time from dynamic field
    let lastClaimTime = 0;
    const dfResp = await client.getDynamicFieldObject({
      parentId: tableId,
      name: { type: 'address', value: addr },
    });
    if (dfResp.data) {
      lastClaimTime = parseInt((dfResp.data.content as any).fields.value, 10);
    }

    if (now < lastClaimTime + COOLDOWN_PERIOD) {
      throw new Error('This wallet has already claimed GLDC in the past 24 hours, please wait, or use a different address');
    }
  };

  const handleFaucet = async () => {
    if (!account) {
      alert('Connect wallet first');
      return;
    }
    setLoading(true);
    try {
      // Pre-check cooldown
      await checkCanClaim(recipient);

      // Build and execute transaction
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::faucet::claim`,
        arguments: [
          tx.object(FAUCET_ID),
          tx.object(CLOCK_ID),
          tx.pure.address(recipient),
        ],
      });
      await new Promise((resolve, reject) => {
        signAndExecute({ transaction: tx }, {
          onSuccess: resolve,
          onError: reject,
        });
      });
      alert('GLDC faucet successful! 1 GLDC sent to ' + recipient);
    } catch (error) {
      alert((error as Error).message || 'Faucet failed: ' + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Div d="flex" align="center" justify="center" minH="100vh" bg="white">
      <Div p="4rem" w="40rem">
        <Text tag="h1" textSize="display3" textColor="#111827" textAlign="left" m={{ b: '1rem' }}>Testnet Faucet</Text>
        <Text textSize="subheader" textColor="#6b7280" textAlign="left" m={{ b: '3rem' }}>
          Send testnet GLDC to your wallet to experiment with fund flows in your app or smart contract for free.
        </Text>
        <Div d="flex" justify="center" m={{ b: '3rem' }}>
          <Div border="1px solid" borderColor="#d1d5db" rounded="xl" p="2rem" d="flex" flexDir="column" align="center" w="12rem">
            <Image src="/gldc.png" w="40px" h="40px" m={{ b: '1rem' }} />
            <Text textSize="title" textColor="#111827">GLDC</Text>
          </Div>
        </Div>
        <Text textSize="body" textColor="#111827" m={{ b: '0.5rem' }}>Network</Text>
        <Div d="flex" align="center" border="1px solid" borderColor="#d1d5db" rounded="md" p="1rem" m={{ b: '2rem' }}>
          <Image src="suilogo.png" w="40px" h="40px" rounded="circle" m={{ r: '1rem' }} />
          <Text textSize="body" textColor="#111827">Sui Testnet</Text>
        </Div>
        <Text textSize="body" textColor="#111827" m={{ b: '0.5rem' }}>Send to</Text>
        <Input
          placeholder="Wallet address"
          value={recipient}
          readOnly={true}
          m={{ b: '0.5rem' }}
          textColor="#111827"
          borderColor="#d1d5db"
          focusBorderColor="#3b82f6"
          rounded="md"
          p="1.5rem"
        />
        <Text textSize="caption" textColor="#6b7280" m={{ b: '2rem' }}>Limit: One request per wallet every 24 hours</Text>
        {account ? (
          <Button
            onClick={handleFaucet}
            disabled={loading}
            style={{ backgroundColor: '#60a5fa', color: 'white', width: '100%', padding: '1rem', borderRadius: '0.75rem', height: '3rem', fontSize: '1rem', fontWeight: '600', lineHeight: '1' }}
            shadow="3"
            hoverShadow="4"
            transition
          >
            {loading ? 'Requesting...' : 'Get 1 GLDC'}
          </Button>
        ) : (
          <ConnectButton style={{ backgroundColor: '#60a5fa', color: 'white', width: '100%', padding: '1rem', borderRadius: '0.75rem', marginTop: '1rem', height: '3rem', fontSize: '1rem', fontWeight: '600', lineHeight: '1' }} />
        )}
      </Div>
    </Div>
  );
};

export default FaucetPage;