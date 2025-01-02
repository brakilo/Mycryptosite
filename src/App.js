import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function App() {
  const [crypto, setCrypto] = useState('ETH'); // Crypto sélectionnée
  const [amount, setAmount] = useState(''); // Montant envoyé
  const [wallet, setWallet] = useState(''); // Adresse du wallet
  const [beraAmount, setBeraAmount] = useState(''); // Montant en BERA
  const [status, setStatus] = useState(''); // Statut de la transaction
  const [prices, setPrices] = useState({ ETH: 0, USDT: 0, BNB: 0 }); // Prix des cryptos en EUR
  const [language, setLanguage] = useState('en'); // Langue sélectionnée
  const [showLanguageMenu, setShowLanguageMenu] = useState(false); // Affichage du menu déroulant

  const translations = {
    en: {
      title: 'Crypto Exchange',
      selectCrypto: 'Select a cryptocurrency to exchange',
      amount: 'Amount in',
      wallet: 'Enter your wallet address',
      beraAmount: 'Estimated amount in BERA',
      exchangeButton: 'Exchange',
      errorWallet: 'Please enter a valid wallet address.',
      errorMetaMask: 'MetaMask not detected. Please install it to continue.',
      errorAmount: 'Please enter a valid amount greater than 0.',
      footer: 'All rights reserved.',
    },
    fr: {
      title: 'Échange de Crypto',
      selectCrypto: 'Sélectionnez une crypto à échanger',
      amount: 'Montant en',
      wallet: 'Entrez votre adresse de portefeuille',
      beraAmount: 'Montant estimé en BERA',
      exchangeButton: 'Échanger',
      errorWallet: 'Veuillez entrer une adresse de portefeuille valide.',
      errorMetaMask: 'MetaMask non détecté. Veuillez l’installer pour continuer.',
      errorAmount: 'Veuillez entrer un montant valide supérieur à 0.',
      footer: 'Tous droits réservés.',
    },
  };

  const t = (key) => translations[language][key];

  const BERA_RATE = 0.0025; // 1 EUR = 0.0025 BERA

  // Générer les étoiles dynamiques
  useEffect(() => {
    const generateStars = () => {
      const starContainer = document.querySelector('.stars');
      if (!starContainer) return;

      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 3 + 1;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        starContainer.appendChild(star);
      }
    };

    generateStars();
  }, []);

  // Récupérer les prix des cryptos depuis l'API CoinGecko
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,tether,binancecoin&vs_currencies=eur'
        );
        const data = await response.json();
        setPrices({
          ETH: data.ethereum.eur,
          USDT: data.tether.eur,
          BNB: data.binancecoin.eur,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des prix :', error);
      }
    };

    fetchPrices();
  }, []);

  // Calculer automatiquement le montant en BERA
  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount)) && prices[crypto]) {
      const cryptoValueInEUR = parseFloat(amount) * prices[crypto]; // Valeur en EUR
      const beraValue = cryptoValueInEUR / BERA_RATE; // Conversion en BERA
      setBeraAmount(beraValue.toFixed(4)); // Arrondi à 4 décimales
    } else {
      setBeraAmount('');
    }
  }, [amount, crypto, prices]);

  const isWalletValid = (walletAddress) => {
    return ethers.isAddress(walletAddress);
  };

  const handleExchange = async () => {
    if (!window.ethereum) {
      setStatus(t('errorMetaMask'));
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setStatus(t('errorAmount'));
      return;
    }

    if (!wallet || !isWalletValid(wallet)) {
      setStatus(t('errorWallet'));
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const transaction = {
        to: '0x6E3Dd2a4e37D01c83802712CfB0b09C1d0001D3c', // Adresse de réception
        value: ethers.parseUnits(amount, 'ether'), // Convertir le montant en wei
        gasLimit: 21000, // Limite de gas standard pour une transaction simple
      };

      const tx = await signer.sendTransaction(transaction);
      setStatus(
        `Transaction envoyée ! Vous avez échangé ${amount} ${crypto} contre ${beraAmount} BERA (simulé). Hash : ${tx.hash}`
      );
    } catch (error) {
      console.error('Erreur lors de la transaction :', error);
      setStatus('Erreur lors de la transaction. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative text-white">
      {/* Banderole stylisée */}
      <div className="fixed bottom-0 w-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400 text-white py-2 text-center font-bold text-lg">
        PRESALE 1 $ = 0.0025 BERA
      </div>

      {/* Arrière-plan étoilé */}
      <div className="stars absolute inset-0 overflow-hidden z-0"></div>

      {/* Ajout de l’ours */}
      <img
        src="/images/bear.png"
        alt="Bear"
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-1/3 opacity-80 pointer-events-none"
      />

      {/* Changement de langue */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          className="bg-gray-700 text-gray-200 p-2 rounded-md"
        >
          Language
        </button>
        {showLanguageMenu && (
          <div className="absolute mt-2 right-0 bg-gray-800 text-white rounded-md shadow-lg">
            <button
              onClick={() => {
                setLanguage('en');
                setShowLanguageMenu(false);
              }}
              className="block px-4 py-2 text-sm hover:bg-gray-700"
            >
              English
            </button>
            <button
              onClick={() => {
                setLanguage('fr');
                setShowLanguageMenu(false);
              }}
              className="block px-4 py-2 text-sm hover:bg-gray-700"
            >
              Français
            </button>
          </div>
        )}
      </div>

      <header className="absolute top-6 left-6">
        <h1 className="text-5xl font-extrabold tracking-wider text-brown-500">Berachain</h1>
      </header>

      <main className="flex flex-col items-center bg-gray-800 bg-opacity-90 p-10 rounded-xl shadow-2xl max-w-lg w-full mt-10 relative z-10">
        <h2 className="text-2xl font-bold mb-4 text-center">{t('title')}</h2>
        <div className="mb-6 w-full">
          <label className="block text-gray-400 mb-2">{t('selectCrypto')}</label>
          <select
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
            className="w-full p-3 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="ETH">Ethereum (ETH)</option>
            <option value="USDT">Tether (USDT)</option>
            <option value="BNB">Binance Coin (BNB)</option>
          </select>
        </div>
        <div className="mb-6 w-full">
          <label className="block text-gray-400 mb-2">{t('wallet')}</label>
          <input
            type="text"
            placeholder="0x..."
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="w-full p-3 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div className="mb-6 w-full">
          <label className="block text-gray-400 mb-2">
            {t('amount')} {crypto}
          </label>
          <input
            type="number"
            placeholder={`Enter amount in ${crypto}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div className="mb-6 w-full">
          <label className="block text-gray-400 mb-2">{t('beraAmount')}</label>
          <input
            type="text"
            value={beraAmount}
            disabled
            className="w-full p-3 bg-gray-700 text-gray-400 rounded-md focus:outline-none cursor-not-allowed"
          />
        </div>
        <button
          onClick={handleExchange}
          className="w-full p-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-md hover:scale-105 transition-transform"
        >
          {t('exchangeButton')}
        </button>
        {status && <p className="mt-4 text-center text-cyan-400">{status}</p>}
      </main>

      <footer className="w-full py-4 text-center text-gray-400 text-sm mt-10 relative z-10">
        © {new Date().getFullYear()} Berachain. {t('footer')}
      </footer>
    </div>
  );
}

export default App;
