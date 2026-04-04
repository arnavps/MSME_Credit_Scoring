import React from 'react'
import TotalBalanceCard from './TotalBalanceCard'
import TopReasonsWidget from './TopReasonsWidget'
import FraudRiskIndicator from './FraudRiskIndicator'
import CreditScoreWidget from './CreditScoreWidget'
import ScoreTrendChart from './ScoreTrendChart'
import LoanOfferWidget from './LoanOfferWidget'
import FeatureContributionChart from './FeatureContributionChart'
import CardsAndWallets from './CardsAndWallets'

export default function Dashboard() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-slate-800 tracking-tight">Good morning, BayFi</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Stay on top of your finances with CredNexis AI, monitor progress, and track status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-6">
          <TotalBalanceCard />
          <TopReasonsWidget />
          <FraudRiskIndicator />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6">
          <CreditScoreWidget />
          <ScoreTrendChart />
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-6 flex-1">
          <CardsAndWallets />
          <LoanOfferWidget />
          <FeatureContributionChart />
        </div>
      </div>
    </div>
  )
}
