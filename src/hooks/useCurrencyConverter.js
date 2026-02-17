import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

export const useCurrencyConverter = (fromCurrency, toCurrency, amount) => {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
 
  const cache = useRef({});

  const fetchRate = useCallback(async (forceUpdate = false) => {
  
    if (fromCurrency === toCurrency) {
      setRate(1);
      return;
    }

    if (!amount || amount <= 0) {
      setRate(null);
      return;
    }

    const cacheKey = `${fromCurrency}-${toCurrency}`;
    if (!forceUpdate && cache.current[cacheKey]) {
      setRate(cache.current[cacheKey]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      const newRate = response.data.rates[toCurrency];
      
      if (newRate) {
        cache.current[cacheKey] = newRate;
        setRate(newRate);
      } else {
        throw new Error("العملة غير مدعومة");
      }
    } catch (err) {
      setError("فشل في تحديث البيانات");
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency, amount]);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  return { rate, loading, error, refresh: () => fetchRate(true) };
};