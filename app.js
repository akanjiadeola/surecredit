const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
menuButton.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', open);
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('open'); menuButton.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
}));
const observer = new IntersectionObserver((entries) => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const heroPhoto = document.querySelector('.hero-photo');
if (heroPhoto && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroPhoto.addEventListener('pointermove', (event) => {
    if (window.innerWidth < 761) return;
    const bounds = heroPhoto.getBoundingClientRect();
    heroPhoto.style.setProperty('--photo-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 7}px`);
    heroPhoto.style.setProperty('--photo-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 7}px`);
  });
  heroPhoto.addEventListener('pointerleave', () => { heroPhoto.style.setProperty('--photo-x', '0px'); heroPhoto.style.setProperty('--photo-y', '0px'); });
}

const formatCurrency = (value) => new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0
}).format(value);

const parseLoanAmount = (value) => {
  const digits = String(value).replace(/[^\d]/g, '');
  return Number(digits || 0);
};

const formatLoanAmountInput = (value) => {
  const digits = String(value).replace(/[^\d]/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('en-NG');
};

const loanAmountInput = document.getElementById('loan-amount');
const interestRateInput = document.getElementById('interest-rate');
const loanTenorInput = document.getElementById('loan-tenor');
const monthlyRepaymentElement = document.getElementById('monthly-repayment');
const totalRepaymentElement = document.getElementById('total-repayment');
const rateValueElement = document.getElementById('rate-value');
const tenorValueElement = document.getElementById('tenor-value');

const updateLoanCalculator = () => {
  if (!loanAmountInput || !interestRateInput || !loanTenorInput || !monthlyRepaymentElement || !totalRepaymentElement || !rateValueElement || !tenorValueElement) {
    return;
  }

  const principal = parseLoanAmount(loanAmountInput.value);
  const rate = Number(interestRateInput.value) || 0;
  const tenor = Number(loanTenorInput.value) || 1;

  loanAmountInput.value = formatLoanAmountInput(loanAmountInput.value);
  rateValueElement.textContent = `${rate.toFixed(1)}%`;
  tenorValueElement.textContent = `${tenor} month${tenor > 1 ? 's' : ''}`;

  if (principal <= 0) {
    monthlyRepaymentElement.textContent = '₦0';
    totalRepaymentElement.textContent = '₦0';
    return;
  }

  const monthlyRate = rate / 100;
  const totalRepayment = principal * (1 + monthlyRate * tenor);
  const monthlyRepayment = totalRepayment / tenor;

  monthlyRepaymentElement.textContent = formatCurrency(monthlyRepayment);
  totalRepaymentElement.textContent = formatCurrency(totalRepayment);
};

if (loanAmountInput && interestRateInput && loanTenorInput) {
  loanAmountInput.addEventListener('input', () => {
    const digitsOnly = String(loanAmountInput.value).replace(/[^\d]/g, '');
    loanAmountInput.value = digitsOnly ? Number(digitsOnly).toLocaleString('en-NG') : '';
    updateLoanCalculator();
  });

  [interestRateInput, loanTenorInput].forEach((input) => {
    input.addEventListener('input', updateLoanCalculator);
  });
  updateLoanCalculator();
}
