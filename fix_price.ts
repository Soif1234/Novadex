import fs from 'fs';
let content = fs.readFileSync('src/PriceContext.tsx', 'utf8');

// replace the state initialization to use market symbols if available
content = content.replace(
  `const [currentPrice, setCurrentPrice] = useState(0);`,
  `const { symbols } = useMarket();
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    if (currentPrice === 0 && symbols && symbols.length > 0) {
      const sym = symbols.find(s => s.symbol === currentSymbol);
      if (sym) {
        setCurrentPrice(parseFloat(sym.price));
      }
    }
  }, [symbols, currentSymbol, currentPrice]);`
);

fs.writeFileSync('src/PriceContext.tsx', content);
