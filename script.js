const price = 3.26;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const cash = document.getElementById('cash');
const displayChangeDue = document.getElementById('change-due');
const purchaseBtn = document.getElementById('purchase-btn');
const cashDrawerDisplay = document.getElementById('cash-drawer-display');

const currencyNameMap = {
  PENNY: 'Pennies',
  NICKEL: 'Nickels',
  DIME: 'Dimes',
  QUARTER: 'Quarters',
  ONE: 'Ones',
  FIVE: 'Fives',
  TEN: 'Tens',
  TWENTY: 'Twenties',
  'ONE HUNDRED': 'Hundreds'
};

const formatResults = (status, change) => {
  displayChangeDue.innerHTML = `<p class="status"><strong>Status:</strong> ${status}</p>`;
  displayChangeDue.innerHTML += change
    .map(
      ([name, amount]) => `<p class="change-line">${name}: $${amount.toFixed(2)}</p>`
    )
    .join('');
};

const updateUI = (change) => {
  if (change) {
    change.forEach(([denomination, changeAmt]) => {
      const drawer = cid.find(([name]) => name === denomination);
      drawer[1] = ((drawer[1] * 100 - changeAmt * 100) / 100);
    });
  }

  cash.value = '';
  cashDrawerDisplay.innerHTML = `<p class="drawer-title"><strong>Cash in Drawer:</strong></p>` +
    cid.map(
      ([name, amount]) => `<p class="drawer-line">${currencyNameMap[name]}: $${amount.toFixed(2)}</p>`
    ).join('');
};

const checkCashRegister = () => {
  const inputCents = Math.round(parseFloat(cash.value) * 100);
  const priceCents = Math.round(price * 100);

  if (isNaN(inputCents)) {
    alert("Please enter a valid amount");
    return;
  }

  if (inputCents < priceCents) {
    alert("Customer does not have enough money to purchase the item");
    cash.value = '';
    return;
  }

  if (inputCents === priceCents) {
    displayChangeDue.innerHTML = '<p class="no-change">No change due - customer paid with exact cash</p>';
    cash.value = '';
    return;
  }

  let changeDue = inputCents - priceCents;

  // Reverse and convert cid to cents
  const reversedCid = [...cid]
    .reverse()
    .map(([name, amt]) => [name, Math.round(amt * 100)]);

  // Denomination values in cents (10000 = $100)
  const denomValues = [10000, 2000, 1000, 500, 100, 25, 10, 5, 1];
  const result = { status: 'OPEN', change: [] };
  const totalCID = reversedCid.reduce((acc, [_, amt]) => acc + amt, 0);

  if (totalCID < changeDue) {
    displayChangeDue.innerHTML = '<p class="status error">Status: INSUFFICIENT_FUNDS</p>';
    return;
  }

  if (totalCID === changeDue) {
    result.status = 'CLOSED';
  }

  for (let i = 0; i < reversedCid.length; i++) {
    const denomName = reversedCid[i][0];
    let denomTotal = reversedCid[i][1];
    const denomVal = denomValues[i];
    let amountUsed = 0;

    while (changeDue >= denomVal && denomTotal > 0) {
      changeDue -= denomVal;
      denomTotal -= denomVal;
      amountUsed += denomVal;
    }

    if (amountUsed > 0) {
      result.change.push([denomName, amountUsed / 100]);
    }
  }

  if (changeDue > 0) {
    displayChangeDue.innerHTML = '<p class="status error">Status: INSUFFICIENT_FUNDS</p>';
    return;
  }

  formatResults(result.status, result.change);
  updateUI(result.change);
};

purchaseBtn.addEventListener('click', checkCashRegister);

cash.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkCashRegister();
});

// Initial drawer update
updateUI();
