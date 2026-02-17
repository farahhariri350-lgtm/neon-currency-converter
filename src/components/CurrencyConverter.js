import React, { useState, useMemo } from 'react';
import { FaExchangeAlt, FaSpinner, FaSyncAlt, FaCoins, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useCurrencyConverter } from '../hooks/useCurrencyConverter';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('SYP');
  const [isSwapping, setIsSwapping] = useState(false);

  const { rate, loading, error, refresh } = useCurrencyConverter(fromCurrency, toCurrency, amount);


  const currencies = [
    { code: 'USD', name: 'دولار أمريكي' },
    { code: 'EUR', name: 'يورو' },
    { code: 'SYP', name: 'ليرة سورية' },
    { code: 'SAR', name: 'ريال سعودي' },
    { code: 'KWD', name: 'دينار كويتي' },
    { code: 'JOD', name: 'دينار أردني' },
    { code: 'EGP', name: 'جنيه مصري' },
    { code: 'AED', name: 'درهم إماراتي' },
    { code: 'TRY', name: 'ليرة تركية' },
  ];

  const bgIcons = useMemo(() => [
    { icon: '$', class: 'c1' }, { icon: '€', class: 'c2' }, 
    { icon: '£', class: 'c3' }, { icon: <FaArrowUp />, class: 'a1' },
    { icon: <FaArrowDown />, class: 'a2' }, { icon: '₿', class: 'c5' }
  ], []);

  const result = useMemo(() => {
    if (rate && amount > 0) {
      return (amount * rate).toLocaleString(undefined, { 
        maximumFractionDigits: 2,
        minimumFractionDigits: 2 
      });
    }
    return null;
  }, [rate, amount]);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      setIsSwapping(false);
    }, 400);
  };

  return (
    <div className="page-wrapper">
      <div className="bg-animation">
        {bgIcons.map((item, index) => (
          <div key={index} className={`floating-item ${item.class}`}>{item.icon}</div>
        ))}
      </div>

      <div className="neon-card animate-in" dir="rtl">
        <header className="card-head">
          <FaCoins className="neon-icon-main pulse" />
          <h1 className="neon-title">Xchange Pro</h1>
        </header>

        <div className="modern-input-group">
          <label>المبلغ</label>
          <input 
            type="number" 
            placeholder="0.00"
            value={amount} 
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            onFocus={(e) => e.target.select()}
          />
        </div>

        <div className={`selection-row ${isSwapping ? 'swapping-animation' : ''}`}>
          <div className="select-container">
            <span className="small-label">من</span>
            <div className="neon-select-wrapper">
              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>{curr.code} - {curr.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="neon-swap-btn" onClick={handleSwap}>
            <FaExchangeAlt className={isSwapping ? 'rotating' : ''} />
          </button>

          <div className="select-container">
            <span className="small-label">إلى</span>
            <div className="neon-select-wrapper">
              <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>{curr.code} - {curr.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button className="neon-submit-btn hover-glow" onClick={refresh} disabled={loading || !amount}>
          {loading ? <FaSpinner className="spin-icon" /> : <><FaSyncAlt /> تحديث أسعار الصرف</>}
        </button>

        {error && <p className="error-msg fade-in">{error}</p>}

        {result && (
          <section className="neon-result-box scale-up-result">
            <p className="res-sub">النتيجة التقريبية الحالية</p>
            <div className="res-main">
               <span className="res-num">{result}</span>
               <span className="res-unit">{toCurrency}</span>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;