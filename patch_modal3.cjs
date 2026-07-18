const fs = require('fs');

let code = fs.readFileSync('src/components/DepositWithdrawModal.tsx', 'utf-8');

code = code.replace(
`            {mode === 'deposit' ? (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col items-center gap-4">`,
`            {mode === 'deposit' ? (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                  <label className="text-xs text-gray-400">Deposit Network</label>
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
                <div className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col items-center gap-4">`
);

fs.writeFileSync('src/components/DepositWithdrawModal.tsx', code);
