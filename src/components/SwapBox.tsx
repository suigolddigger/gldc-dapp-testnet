// SwapBox.tsx
import { useState } from 'react';
import { Icon } from 'atomize';
import { ConnectButton } from '@mysten/dapp-kit';
import { Div, Input, Text, Button, Image } from 'atomize';

interface SwapBoxProps {
  account: any;
  error: string | null;
  inputAmount: string;
  setInputAmount: (value: string) => void;
  outputAmount: string;
  isGldcToUsdc: boolean;
  setIsGldcToUsdc: (value: boolean) => void;
  usdcBalance: any;
  gldcBalance: any;
  reserveData: any;
  poolData: any;
  handleSwap: () => void;
  disconnect: () => void;
  swapError: string | null;
  suiBalance: any;
}

const SwapBox = ({
  account,
  error,
  inputAmount,
  setInputAmount,
  outputAmount,
  isGldcToUsdc,
  setIsGldcToUsdc,
  usdcBalance,
  gldcBalance,
  reserveData,
  poolData,
  handleSwap,
  disconnect,
  swapError,
}: SwapBoxProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const inputLogo = isGldcToUsdc ? "/gldc.png" : "/usdc.png";
  const outputLogo = isGldcToUsdc ? "/usdc.png" : "/gldc.png";
  const inputSymbol = isGldcToUsdc ? 'GLDC' : 'USDC';
  const outputSymbol = isGldcToUsdc ? 'USDC' : 'GLDC';
  const inputBalance = ((isGldcToUsdc ? Number(gldcBalance?.totalBalance || 0) : Number(usdcBalance?.totalBalance || 0)) / 1e6).toFixed(6);
  const outputBalance = ((isGldcToUsdc ? Number(usdcBalance?.totalBalance || 0) : Number(gldcBalance?.totalBalance || 0)) / 1e6).toFixed(6);

  const price = poolData ? Number(poolData.fields.last_gold_price) / Math.pow(10, Number(poolData.fields.last_exponent)) : 0;
  const gldcUsdPrice = price / 1000; // USD per GLDC
  const feePercent = poolData ? Number(poolData.fields.fee_bps) / 100 : 1.25;

  const inputUsd = isGldcToUsdc ? Number(inputAmount || 0) * gldcUsdPrice : Number(inputAmount || 0);
  const outputUsd = isGldcToUsdc ? Number(outputAmount || 0) : Number(outputAmount || 0) * gldcUsdPrice;

  let receiveToken = isGldcToUsdc ? 'USDC' : 'GLDC';
  let sendToken = isGldcToUsdc ? 'GLDC' : 'USDC';
  let rate = isGldcToUsdc ? (price / 1000) : (1000 / price);
  let usdPer = isGldcToUsdc ? gldcUsdPrice : 1;
  const exchangeRateText = `1 ${sendToken} = ${rate.toFixed(7)} ${receiveToken} ($${usdPer.toFixed(2)})`;

  const usdcLiquidity = reserveData ? (Number(reserveData.fields.usdc_balance) / 1e6).toFixed(6) : '0.000000';
  const gldcLiquidity = reserveData ? (Number(reserveData.fields.gldc_balance) / 1e6).toFixed(6) : '0.000000';

  // Handle input change to allow only numeric values (with decimal) and max 9 digits total (excluding decimal point)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const digitCount = value.replace('.', '').length;
      if (digitCount <= 9) {
        setInputAmount(value);
      }
    }
  };

  const buttonText = swapError || 'Swap';
  const isDisabled = !!swapError || !inputAmount;

  return (
    <Div 
      d="flex" 
      align="center" 
      justify="center" 
      minH="100vh" 
      style={{ 
        backgroundImage: `url('/Backgroundgldc.avif')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <Div w="100%" maxW="32rem" m={{ t: '0' }} textAlign="center">
        <Div pos="relative" bg="white" p={{ x: '1.5rem', t: '2.5rem', b: '1.5rem' }} rounded="xl" shadow="3" h="auto" m={{ t: '0' }}>
          {error && <Text textColor="danger700" textSize="title" textAlign="center" m={{ b: '1rem' }}>{error}</Text>}
          {/* Always show the boxes */}
          <>
            {/* Send Box */}
            <Div bg="white" border="1px solid" borderColor="#E5E7EB" rounded="xl" p="1rem" m={{ b: '0.5rem' }}>
              <Div d="flex" justify="space-between" m={{ b: '0.25rem' }}>
                <Text textColor="#6b7280" textSize="caption">Send</Text>
                <Text textColor="#6b7280" textSize="caption">Balance: {inputBalance}</Text>
              </Div>
              <Div d="flex" justify="space-between" align="center" w="100%" style={{ boxSizing: 'border-box' }}>
                <Div flex="1 1 auto" style={{ minWidth: 0 }}>
                  <Input
                    placeholder="0.0"
                    value={inputAmount}
                    onChange={handleInputChange}
                    type="text"
                    border="none"
                    borderColor="transparent"
                    focusBorderColor="transparent"
                    boxShadow="none"
                    focusBoxShadow="none"
                    outline="none"
                    appearance="none"
                    background="transparent"
                    textSize="display1"
                    w="100%"
                    p="0"
                    style={{ outline: 'none', border: 'none', boxSizing: 'border-box' }}
                  />
                </Div>
                <Div d="flex" align="center" bg="#F3F4F6" p={{ x: '0.75rem', y: '0.5rem' }} rounded="md" style={{ boxSizing: 'border-box' }}>
                  <Image src={inputLogo} w="30px" h="30px" m={{ r: '0.5rem' }} />
                  <Text textSize="subheader" textWeight="500" textColor="#000">{inputSymbol}</Text>
                </Div>
              </Div>
              <Text textColor="#6b7280" textSize="subheader" textAlign="left">${inputUsd.toFixed(2)}</Text>
            </Div>

            {/* Switch Arrow - Centered and larger */}
            <Div d="flex" justify="center" align="center" m={{ y: '0.5rem' }}>
              <Icon name="DownArrow" size="40px" color="#6b7280" cursor="pointer" onClick={() => setIsGldcToUsdc(!isGldcToUsdc)} />
            </Div>

            {/* Receive Box */}
            <Div bg="white" border="1px solid" borderColor="#E5E7EB" rounded="xl" p="1rem" m={{ b: '1rem' }}>
              <Div d="flex" justify="space-between" m={{ b: '0.25rem' }}>
                <Text textColor="#6b7280" textSize="caption">Receive</Text>
                <Text textColor="#6b7280" textSize="caption">Balance: {outputBalance}</Text>
              </Div>
              <Div d="flex" justify="space-between" align="center" w="100%" style={{ boxSizing: 'border-box' }}>
                <Div flex="1 1 auto" style={{ minWidth: 0 }}>
                  <Text textSize="display1" textColor="#111827">
                    {outputAmount || '0.0'}
                  </Text>
                </Div>
                <Div d="flex" align="center" bg="#F3F4F6" p={{ x: '0.75rem', y: '0.5rem' }} rounded="md" style={{ boxSizing: 'border-box' }}>
                  <Image src={outputLogo} w="30px" h="30px" m={{ r: '0.5rem' }} />
                  <Text textSize="subheader" textWeight="500" textColor="#000">{outputSymbol}</Text>
                </Div>
              </Div>
              <Text textColor="#6b7280" textSize="subheader" textAlign="left">${isNaN(outputUsd) ? '0.00' : outputUsd.toFixed(2)}</Text>
            </Div>
          </>

          {/* Conditional Button - Moved above the info */}
          {account ? (
            <Button
              onClick={handleSwap}
              disabled={isDisabled}
              style={{ 
                backgroundColor: isDisabled ? '#E5E5EB' : '#60a5fa', 
                color: isDisabled ? '#6B7280' : 'white', 
                width: '100%', 
                padding: '1rem', 
                borderRadius: '0.75rem', 
                marginTop: '1.5rem', 
                height: '3rem', 
                fontSize: '1rem', 
                fontWeight: '600', 
                lineHeight: '1' 
              }}
              shadow="3"
              hoverShadow="4"
              transition
              textSize="title"
            >
              {buttonText}
            </Button>
          ) : (
            <ConnectButton style={{ backgroundColor: '#60a5fa', color: 'white', width: '100%', padding: '1rem', borderRadius: '0.75rem', marginTop: '1rem', height: '3rem', fontSize: '1rem', fontWeight: '600', lineHeight: '1' }} />
          )}

          {/* Bottom Info - Exchange rate always shown, with toggle for details */}
          <Div m={{ t: '1rem' }}>
            <Div 
              d="flex" 
              justify="space-between" 
              align="center" 
              m={{ b: '0.5rem' }} 
              cursor="pointer" 
              onClick={() => setShowDetails(!showDetails)}
            >
              <Text textColor="#6b7280" textSize="body">Exchange rate</Text>
              <Div d="flex" align="center">
                <Text textColor="#6b7280" textSize="body" m={{ r: '0.5rem' }}>{exchangeRateText}</Text>
                <Icon 
                  name="RightArrow" 
                  size="16px" 
                  color="#6b7280" 
                  rotate={showDetails ? '90deg' : '0deg'} 
                  transition 
                />
              </Div>
            </Div>
            {showDetails && (
              <>
                <Div d="flex" justify="space-between" m={{ b: '0.5rem' }}>
                  <Text textColor="#6b7280" textSize="body">Fee</Text>
                  <Text textColor="#6b7280" textSize="body">{feePercent.toFixed(2)}%</Text>
                </Div>
                <Div d="flex" justify="space-between" m={{ b: '0.5rem' }}>
                  <Text textColor="#6b7280" textSize="body">Min USDC Swap</Text>
                  <Text textColor="#6b7280" textSize="body">3.00</Text>
                </Div>
                <Div d="flex" justify="space-between" m={{ b: '0.5rem' }}>
                  <Text textColor="#6b7280" textSize="body">Min GLDC Swap</Text>
                  <Text textColor="#6b7280" textSize="body">1.00</Text>
                </Div>
                <Div d="flex" justify="space-between" m={{ b: '0.5rem' }}>
                  <Text textColor="#6b7280" textSize="body">USDC Pool Liquidity</Text>
                  <Text textColor="#6b7280" textSize="body">{usdcLiquidity}</Text>
                </Div>
                <Div d="flex" justify="space-between">
                  <Text textColor="#6b7280" textSize="body">GLDC Pool Liquidity</Text>
                  <Text textColor="#6b7280" textSize="body">{gldcLiquidity}</Text>
                </Div>
              </>
            )}
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

export default SwapBox;