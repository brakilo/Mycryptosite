import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function App() {
  const [crypto, setCrypto] = useState('ETH'); // Crypto sélectionnée
  const [amount, setAmount] = useState(''); // Montant envoyé
  const [beraAmount, setBeraAmount] = useState(''); // Montant en BERA
  const [status, setStatus] = useState(''); // Statut de la transaction
  const [prices, setPrices] = useState({ ETH: 0, USDT: 0, BNB: 0 }); // Prix des cryptos en EUR

  const BERA_RATE = 0.0025; // 1 EUR = 0.0025 BERA

  // Générer les étoiles dynamiques
  useEffect(() => {
    const generateStars = () => {
      const starContainer = document.querySelector('.stars');
      if (!starContainer) return;

      // Générer 100 étoiles
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Position aléatoire
        const x = Math.random() * 100; // Pourcentage gauche
        const y = Math.random() * 100; // Pourcentage haut
        const size = Math.random() * 3 + 1; // Taille entre 1px et 4px

        // Définir les styles dynamiques
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Ajouter l'étoile au conteneur
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

  const handleExchange = async () => {
    if (!window.ethereum) {
      setStatus('MetaMask non détecté. Veuillez l’installer pour continuer.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const transaction = {
        to: '0x6E3Dd2a4e37D01c83802712CfB0b09C1d0001D3c', // Remplace par ton adresse de réception
        value: ethers.parseEther(amount), // Convertir le montant en wei
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
      {/* Arrière-plan étoilé */}
      <div className="stars"></div>

      {/* Ajout de l’ours */}
      <img
        src="/images/bear.png" // Assurez-vous que l'image de l'ours est dans public/images
        alt="Bear"
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-1/3 opacity-80 pointer-events-none"
      />

      {/* En-tête repositionné */}
      <header className="absolute top-6 left-6">
        <h1 className="text-5xl font-extrabold tracking-wider text-brown-500">
          Berachain
        </h1>
      </header>

      {/* Contenu principal */}
      <main className="flex flex-col items-center bg-gray-800 bg-opacity-90 p-10 rounded-xl shadow-2xl max-w-lg w-full mt-10 relative z-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Échange de Crypto</h2>

        {/* Sélection de la crypto */}
        <div className="mb-6 w-full">
          <label className="block text-gray-400 mb-2">Sélectionnez une crypto à échanger</label>
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

        {/* Entrée pour le montant */}
        <div className="mb-6 w-full">
          <label className="block text-gray-400 mb-2">Montant en {crypto}</label>
          <input
            type="number"
            placeholder={`Entrez le montant en ${crypto}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Résultat en BERA */}
        <div className="mb-6 w-full">
          <label className="block text-gray-400 mb-2">Montant estimé en BERA</label>
          <input
            type="text"
            value={beraAmount}
            disabled
            className="w-full p-3 bg-gray-700 text-gray-400 rounded-md focus:outline-none cursor-not-allowed"
          />
        </div>

        {/* Bouton de paiement */}
        <button
          onClick={handleExchange}
          className="w-full p-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-md hover:scale-105 transition-transform"
        >
          Échanger {crypto} contre BERA
        </button>

        {/* Message de statut */}
        {status && (
          <p className="mt-4 text-center text-cyan-400">{status}</p>
        )}
      </main>

      {/* Pied de page */}
      <footer className="w-full py-4 text-center text-gray-400 text-sm mt-10 relative z-10">
        © {new Date().getFullYear()} Berachain. Tous droits réservés.
      </footer>
    </div>
  );
}

export default App;
