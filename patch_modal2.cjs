const fs = require('fs');

let code = fs.readFileSync('src/components/DepositWithdrawModal.tsx', 'utf-8');

code = code.replace(
`} else if (selectedToken === 'USDC' && currentUsdcAddress) {
        const decimals = chainId === bsc.id ? 18 : 6;
        const usdcContract = new ethers.Contract(currentUsdcAddress, erc20Abi, connectedWallet);
        const parsedAmount = ethers.parseUnits(amount, decimals);
        const tx = await usdcContract.transfer(destinationAddress, parsedAmount);
        setTxHash(tx.hash);
      }`,
`} else if (selectedToken === 'USDC' && currentUsdcAddress) {
        const decimals = chainId === bsc.id ? 18 : 6;
        const usdcContract = new ethers.Contract(currentUsdcAddress, erc20Abi, connectedWallet);
        const parsedAmount = ethers.parseUnits(amount, decimals);
        const tx = await usdcContract.transfer(destinationAddress, parsedAmount);
        setTxHash(tx.hash);
      } else if (selectedToken === 'USDT' && currentUsdtAddress) {
        const decimals = chainId === bsc.id ? 18 : 6;
        const usdtContract = new ethers.Contract(currentUsdtAddress, erc20Abi, connectedWallet);
        const parsedAmount = ethers.parseUnits(amount, decimals);
        const tx = await usdtContract.transfer(destinationAddress, parsedAmount);
        setTxHash(tx.hash);
      }`
);

code = code.replace(
`      if (selectedToken === 'Native') { 
         return nativeBalanceData ? formatEther(nativeBalanceData.value).substring(0, 8) : '0';
      } else { 
         return usdcBalanceDataRaw ? ethers.formatUnits(usdcBalanceDataRaw as bigint, chainId === bsc.id ? 18 : 6).substring(0, 8) : '0';
      }`,
`      if (selectedToken === 'Native') { 
         return nativeBalanceData ? formatEther(nativeBalanceData.value).substring(0, 8) : '0';
      } else if (selectedToken === 'USDC') { 
         return usdcBalanceDataRaw ? ethers.formatUnits(usdcBalanceDataRaw as bigint, chainId === bsc.id ? 18 : 6).substring(0, 8) : '0';
      } else {
         return usdtBalanceDataRaw ? ethers.formatUnits(usdtBalanceDataRaw as bigint, chainId === bsc.id ? 18 : 6).substring(0, 8) : '0';
      }`
);

// We need to add a chain selector and the USDT option in the HTML
code = code.replace(
`                        <option value="Native">{nativeSymbol}</option>
                        <option value="USDC">USDC</option>
                      </select>`,
`                        <option value="Native">{nativeSymbol}</option>
                        <option value="USDC">USDC</option>
                        <option value="USDT">USDT</option>
                      </select>`
);

code = code.replace(
`              <form onSubmit={handleInternalWithdraw} className="space-y-4">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-3">
                  <div className="space-y-1">`,
`              <form onSubmit={handleInternalWithdraw} className="space-y-4">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Withdrawal Network</label>
                    <select
                      value={chainId}
                      onChange={(e) => setEmailChainId(Number(e.target.value))}
                      className="bg-[#0B0E14] border border-white/10 rounded-lg w-full p-2.5 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50"
                    >
                      {chainsList.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">`
);

fs.writeFileSync('src/components/DepositWithdrawModal.tsx', code);
