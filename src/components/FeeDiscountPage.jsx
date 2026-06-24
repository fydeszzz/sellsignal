import { useMemo } from 'react';
import { feeDiscount } from '../lib/feeDiscount.js';
import { asset } from '../lib/asset.js';
import { fmt } from '../lib/format.js';
import InfoTip from './InfoTip.jsx';

export default function FeeDiscountPage({ t, lang, amount, setAmount, feePaid, setFeePaid, onApply }) {
  const result = useMemo(
    () => feeDiscount({ amount: parseFloat(amount), feePaid: parseFloat(feePaid) }),
    [amount, feePaid],
  );
  // A valid reverse-calc vs. the "too small" floor case vs. the explicit
  // "overpaid" mistake vs. blank input. Kept apart so the page can explain
  // each case instead of silently blanking or inventing a meaningless discount.
  const ok       = result && !result.error && !result.tooSmall;
  const overpaid = result?.error === 'overpaid';
  const tooSmall = !!result?.tooSmall;

  return (
    <main className="grid fees-page">
      <section className="panel form">
        <div className="page-head">
          <div className="page-title-row">
            <img className="page-icon" src={asset('calculator.png')} alt="" aria-hidden />
            <h2 className="page-title">{t.feeDiscTitle}</h2>
          </div>
        </div>

        <label className="field">
          <span className="label">{t.tradeAmount}</span>
          <div className="input-affix">
            <span className="prefix">TWD</span>
            <input
              className="input mono"
              type="number"
              step="1"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100000"
            />
          </div>
        </label>

        <label className="field">
          <span className="label">
            {t.feePaid}
            <InfoTip lines={[t.feeDiscHint, t.feeDiscDisclaimer]} />
          </span>
          <div className="input-affix">
            <span className="prefix">TWD</span>
            <input
              className="input mono"
              type="number"
              step="1"
              min="0"
              value={feePaid}
              onChange={(e) => setFeePaid(e.target.value)}
              placeholder="85"
            />
          </div>
        </label>
      </section>

      <section className="panel output">
        <div className="output-head sell-head">
          <span className="kicker">{t.yourDiscount}</span>
        </div>

        {/* Discount result in its own framed box on the line below, mirroring
            the sell-target price layout on the calculator. */}
        {ok && (
          <div className="input-affix sell-price">
            <div className="input mono sell-price-value">
              {lang === 'zh' ? `${fmt(result.zhe, 1)} 折` : `×${fmt(result.discount, 2)}`}
            </div>
          </div>
        )}

        {ok ? (
          <>
            <dl className="stats">
              <div>
                <dt>{t.effectiveRate}</dt>
                <dd className="mono">{fmt(result.effectiveRate, 4)}%</dd>
              </div>
              <div>
                <dt>{t.baseCommission}</dt>
                <dd className="mono">TWD {fmt(result.baseFee)}</dd>
              </div>
            </dl>
            {/* Carry the reverse-calculated discount over to the sell-target page's
                commission multiplier (2-dp, matching that field's step). */}
            <button
              className="btn apply-btn"
              onClick={() => onApply?.(Math.round(result.discount * 100) / 100)}
            >
              {t.feeDiscApply}
            </button>
          </>
        ) : tooSmall ? (
          <p className="output-note">{t.feeDiscMinNote}</p>
        ) : overpaid ? (
          <p className="error">{t.feeDiscOverpaid}</p>
        ) : (
          <p className="muted">{t.feeDiscPlaceholder}</p>
        )}
      </section>
    </main>
  );
}
