import { Div, Text, Anchor } from 'atomize';
import { Link } from 'react-router-dom';

const TestnetTasks = () => {
  return (
    <Div bg="white" p={{ x: '4rem', y: '4rem' }}>
      <Text tag="h1" textSize="display3" textColor="#111827" textAlign="center" m={{ b: '4rem' }}>
        Testnet Tasks - Win Your Share of $2,000 in Prizes!
      </Text>
      <Div maxW="60rem" m="auto">
        <Div m={{ l: '2rem' }}>
          <Text textSize="body1" textColor="#111827" m={{ b: '1rem' }}>
            1. Download the <Anchor href="https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil" target="_blank" rel="noopener noreferrer" textColor="#3b82f6" hoverTextColor="#2563eb" textWeight="bold" d="inline">Slush wallet extension</Anchor> (recommended) or any other wallet compatible with Sui testnet. Please use the Chrome browser for best results.
          </Text>
          <Text textSize="body1" textColor="#111827" m={{ b: '1rem' }}>
            2. Create a new account if you don't have one, save the recovery phrase securely.
          </Text>
          <Text textSize="body1" textColor="#111827" m={{ b: '1rem' }}>
            3. Click the profile icon on the bottom of the extension, click network, and switch to testnet.
          </Text>
          <Text textSize="body1" textColor="#111827" m={{ b: '1rem' }}>
            4. Visit the <Anchor href="https://faucet.sui.io/" target="_blank" rel="noopener noreferrer" textColor="#3b82f6" hoverTextColor="#2563eb" textWeight="bold" d="inline">Sui faucet</Anchor> and redeem sui to your wallet.
          </Text>
          <Text textSize="body1" textColor="#111827" m={{ b: '1rem' }}>
            5. Go to the <Anchor href="/faucet" target="_blank" rel="noopener noreferrer" textColor="#3b82f6" hoverTextColor="#2563eb" textWeight="bold" d="inline">GLDC faucet</Anchor> and redeem 1 testnet GLDC to your wallet.
          </Text>
          <Text textSize="body1" textColor="#111827" m={{ b: '1rem' }}>
            6. Navigate to the <Anchor href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" textColor="#3b82f6" hoverTextColor="#2563eb" textWeight="bold" d="inline">Circle faucet</Anchor>, select Sui testnet from the dropdown, and collect 10 testnet USDC to your wallet.
          </Text>
          <Text textSize="body1" textColor="#111827" m={{ b: '1rem' }}>
            7. Go to the swap page, and test performing at least 1 swap from GLDC to USDC, and 1 swap from USDC to GLDC.
          </Text>
          <Text textSize="body1" textColor="#111827" m={{ b: '1rem' }}>
            8. Visit <Anchor href="https://suiscan.xyz/testnet" target="_blank" rel="noopener noreferrer" textColor="#3b82f6" hoverTextColor="#2563eb" textWeight="bold" d="inline">suiscan.xyz/testnet</Anchor> or <Anchor href="https://testnet.suivision.xyz" target="_blank" rel="noopener noreferrer" textColor="#3b82f6" hoverTextColor="#2563eb" textWeight="bold" d="inline">testnet.suivision.xyz</Anchor> and paste your address into the search bar to see the transactions and copy the transaction hashes.
          </Text>
          <Div d="flex" flexDir="column" m={{ b: '1rem' }}>
            <Text textSize="body1" textColor="#111827">
              9. Follow <Anchor href="https://x.com/GldcWorld" target="_blank" rel="noopener noreferrer" textColor="#3b82f6" hoverTextColor="#2563eb" textWeight="bold" d="inline">@gldcworld on X</Anchor> and comment on our pinned post:
            </Text>
            <Text textSize="body1" textColor="#111827" m={{ t: '0.5rem' }}>
              - Transaction hash showing a USDC to GLDC swap.
            </Text>
            <Text textSize="body1" textColor="#111827" m={{ t: '0.5rem' }}>
              - Transaction hash showing a GLDC to USDC swap.
            </Text>
            <Text textSize="body1" textColor="#111827" m={{ t: '0.5rem' }}>
              - Sui wallet address to receive your prize "0x.."
            </Text>
            <Text textSize="body1" textColor="#111827" m={{ t: '0.5rem' }}>
              - You must like, comment, follow, and repost to be eligible for the $2,000 USD giveaway!
            </Text>
          </Div>
          <Text textSize="body1" textColor="#111827" m={{ b: '1rem' }}>
            10. That's it! Please swap as many times as you want and provide any feedback via this <Anchor href="https://docs.google.com/forms/d/e/1FAIpQLScPhCbHoCT3aC0r8X24kSzsmXRB_v-NDJl7f82x4QRM0h6JPg/viewform" target="_blank" rel="noopener noreferrer" textColor="#3b82f6" hoverTextColor="#2563eb" textWeight="bold" d="inline">Google Form</Anchor> or <Anchor href="https://x.com/GldcWorld" target="_blank" rel="noopener noreferrer" textColor="#3b82f6" hoverTextColor="#2563eb" textWeight="bold" d="inline">DM us on X</Anchor>.
          </Text>
        </Div>
        <Div m={{ t: '4rem' }} textAlign="center">
          <Text textSize="caption" textColor="#6b7280">
            *Users who complete testnet tasks will be eligible for prizes ranging from $1 to $250, paid in mainnet GLDC. This GLDC can be traded for USDC or any other cryptocurrencies at any time. Prizes are not guaranteed to all users; only the first users to complete testnet tasks will be eligible, and once $2,000 in value has been claimed, no additional testnet prizes will be available.
          </Text>
        </Div>
      </Div>
    </Div>
  );
};

export default TestnetTasks;