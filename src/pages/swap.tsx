// swap.tsx
import React, { useState, useEffect } from 'react';
import {
  useCurrentAccount,
  useDisconnectWallet,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { SuiPythClient, SuiPriceServiceConnection } from '@pythnetwork/pyth-sui-js';
import SwapBox from '../components/SwapBox';

// Constants (updated min/max to match user specs)
const PYTH_STATE_ID = '0x243759059f4c3111179da5878c12f68d612c21a8d54d85edc86164bb18be1c7c';
const WORMHOLE_STATE_ID = '0x31358d198147da50db32eda2562951d53973a0c0ad5ed738e9b17d88b213d790';
const GOLD_FEED_ID = '0x30a19158f5a54c0adf8fb7560627343f22a1bc852b89d56be1accdc5dbf96d0e';
const HERMES_URL = 'https://hermes-beta.pyth.network';
const PACKAGE_ID = '0xb8cd85446a780afce82a1203ede7d23a10fe42cd3acaee8e60c80bfaf98df5a8';
const POOL_ID = '0x32d2bcdee9eefa4259b2d8a96f5960b483ef1afb9c82afe499da74d48db47d26';
const RESERVE_ID = '0xb3a4b36340babba207bc4cc4704d367342e3fce012b275a65e109a4f664bed31';
const FEE_VAULT_ID = '0x4f9d05c87fc675eb6e4e02c7c90a335aa829a1a50bc9e84d976e586b4b09b09c';
const CLOCK_ID = '0x6';
const GLDC_PER_OZ = 1000;
const DECIMALS = 6;
const USDC_TYPE = '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC';
const GLDC_TYPE = '0xbb581110a1f0e74384ac54c517ecdfba8845e2ac73a57c4badedeb50e03cd257::gldc::GLDC';
const MIN_USDC_SWAP = 3_000_000; // 3 USDC
const MAX_USDC_SWAP = 9_500_000_000; // 9500 USDC
const MIN_GLDC_SWAP = 1_000_000; // 1 GLDC
const MAX_GLDC_SWAP = 2_500_000_000; // 2500 GLDC
const GAS_THRESHOLD = 200_000_000; // 0.2 SUI in mist (buffer for gas)

interface SwapPool {
  fields: {
    last_gold_price: string;
    last_exponent: string;
    fee_bps: string;
  };
}

interface SwapReserve {
  fields: {
    usdc_balance: string;
    gldc_balance: string;
    min_liquidity: string;
  };
}

const SwapPage: React.FC = () => {
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [swapError, setSwapError] = useState<string | null>(null);
  const [isGldcToUsdc, setIsGldcToUsdc] = useState(false);
  const [poolData, setPoolData] = useState<SwapPool | null>(null);
  const [reserveData, setReserveData] = useState<SwapReserve | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wallet balances with auto-refetch
  const { data: usdcBalance, refetch: refetchUsdc } = useSuiClientQuery('getBalance', {
    owner: account?.address ?? '',
    coinType: USDC_TYPE,
  }, { refetchInterval: 5000 });
  const { data: gldcBalance, refetch: refetchGldc } = useSuiClientQuery('getBalance', {
    owner: account?.address ?? '',
    coinType: GLDC_TYPE,
  }, { refetchInterval: 5000 });
  const { data: suiBalance } = useSuiClientQuery('getBalance', {
    owner: account?.address ?? '',
    coinType: '0x2::sui::SUI',
  }, { refetchInterval: 5000 });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const pool = await suiClient.getObject({ id: POOL_ID, options: { showContent: true } });
      if (pool.data?.content?.dataType !== 'moveObject') throw new Error('Failed to fetch pool data');
      setPoolData(pool.data.content as unknown as SwapPool);

      const reserve = await suiClient.getObject({ id: RESERVE_ID, options: { showContent: true } });
      if (reserve.data?.content?.dataType !== 'moveObject') throw new Error('Failed to fetch reserve data');
      setReserveData(reserve.data.content as unknown as SwapReserve);
    } catch (error) {
      console.error('Error fetching pool/reserve data:', error);
      setError('Failed to load pool or reserve data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [suiClient]);

  useEffect(() => {
    if (!poolData || !reserveData || !inputAmount) {
      setOutputAmount('');
      setSwapError(null);
      return;
    }

    const input = Number(inputAmount);
    if (isNaN(input) || input <= 0) {
      setOutputAmount('');
      setSwapError(null);
      return;
    }

    const inputScaled = input * Math.pow(10, DECIMALS);
    const feeBps = Number(poolData.fields.fee_bps);
    const inputAfterFee = inputScaled * (1 - feeBps / 10000);
    const price = Number(poolData.fields.last_gold_price) / Math.pow(10, Number(poolData.fields.last_exponent));

    let outputScaled: number;
    if (isGldcToUsdc) {
      outputScaled = (inputAfterFee * price) / GLDC_PER_OZ;
    } else {
      outputScaled = (inputAfterFee * GLDC_PER_OZ) / price;
    }

    const output = outputScaled / Math.pow(10, DECIMALS);
    setOutputAmount(output.toFixed(6));

    // Separate error checks
    let newError: string | null = null;
    const walletBalance = isGldcToUsdc ? Number(gldcBalance?.totalBalance || 0) / Math.pow(10, DECIMALS) : Number(usdcBalance?.totalBalance || 0) / Math.pow(10, DECIMALS);
    if (input > walletBalance) {
      newError = 'Insufficient balance';
    } else if (inputScaled < (isGldcToUsdc ? MIN_GLDC_SWAP : MIN_USDC_SWAP)) {
      newError = 'Amount below minimum';
    } else if (inputScaled > (isGldcToUsdc ? MAX_GLDC_SWAP : MAX_USDC_SWAP)) {
      newError = 'Amount exceeds maximum';
    } else {
      const availableLiquidity = isGldcToUsdc
        ? Number(reserveData.fields.usdc_balance) - Number(reserveData.fields.min_liquidity)
        : Number(reserveData.fields.gldc_balance) - Number(reserveData.fields.min_liquidity);
      if (outputScaled > availableLiquidity) {
        newError = 'Insufficient liquidity';
      }
    }

    // Gas check
    if (!newError && Number(suiBalance?.totalBalance || 0) < GAS_THRESHOLD) {
      newError = 'Insufficient SUI for gas';
    }

    setSwapError(newError);
  }, [inputAmount, isGldcToUsdc, poolData, reserveData, gldcBalance, usdcBalance, suiBalance]);

  const handleSwap = async () => {
    if (!account || !inputAmount || swapError) {
      alert('Please connect wallet, enter valid amount, check liquidity, or check balance');
      return;
    }
    const input = Number(inputAmount);
    const walletBalance = isGldcToUsdc ? Number(gldcBalance?.totalBalance || 0) / Math.pow(10, DECIMALS) : Number(usdcBalance?.totalBalance || 0) / Math.pow(10, DECIMALS);
    if (input > walletBalance) {
      alert('Insufficient balance');
      return;
    }

    try {
      const connection = new SuiPriceServiceConnection(HERMES_URL, { priceFeedRequestConfig: { binary: true } });
      const priceIDs = [GOLD_FEED_ID];
      const priceUpdateData = await connection.getPriceFeedsUpdateData(priceIDs);

      const tx = new Transaction();
      const pythClient = new SuiPythClient(suiClient, PYTH_STATE_ID, WORMHOLE_STATE_ID);
      const [priceInfoObject] = await pythClient.updatePriceFeeds(tx, priceUpdateData, priceIDs);

      const coinType = isGldcToUsdc ? GLDC_TYPE : USDC_TYPE;
      const coinsResponse = await suiClient.getCoins({ owner: account.address, coinType });
      const coinIds = coinsResponse.data.map((coin) => coin.coinObjectId);

      let coinIn: any;
      if (coinIds.length > 0) {
        coinIn = tx.object(coinIds[0]);
        if (coinIds.length > 1) {
          for (let i = 1; i < coinIds.length; i++) {
            tx.mergeCoins(coinIn, [tx.object(coinIds[i])]);
          }
        }
      } else {
        throw new Error(`No ${coinType} coins found in wallet`);
      }

      const inputValue = Math.floor(Number(inputAmount) * Math.pow(10, DECIMALS));
      const [splitCoin] = tx.splitCoins(coinIn, [tx.pure.u64(inputValue)]);

      tx.moveCall({
        package: PACKAGE_ID,
        module: 'swap',
        function: isGldcToUsdc ? 'swap_gldc_to_usdc' : 'swap_usdc_to_gldc',
        arguments: [
          tx.object(POOL_ID),
          tx.object(RESERVE_ID),
          tx.object(FEE_VAULT_ID),
          splitCoin,
          tx.object(priceInfoObject),
          tx.pure.u64(0),
          tx.object(CLOCK_ID),
        ],
      });

      tx.setGasBudget(100000000);
      await new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log('Swap Tx Digest:', result.digest);
              fetchData();
              refetchUsdc();
              refetchGldc();
              alert('Swap successful!');
              resolve(result);
            },
            onError: (error) => {
              console.error('Swap Error:', error);
              alert('Swap failed: ' + String(error));
              reject(error);
            },
          },
        );
      });
    } catch (error) {
      console.error('Swap failed:', error);
      alert('Swap failed: ' + String(error));
    }
  };

  return (
    <SwapBox
      account={account}
      error={error}
      inputAmount={inputAmount}
      setInputAmount={setInputAmount}
      outputAmount={outputAmount}
      isGldcToUsdc={isGldcToUsdc}
      setIsGldcToUsdc={setIsGldcToUsdc}
      usdcBalance={usdcBalance}
      gldcBalance={gldcBalance}
      reserveData={reserveData}
      poolData={poolData}
      handleSwap={handleSwap}
      disconnect={disconnect}
      swapError={swapError}
      suiBalance={suiBalance}
    />
  );
};

export default SwapPage;