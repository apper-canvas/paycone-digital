import userAccountData from "@/services/mockData/userAccount.json";

class UserAccountService {
  constructor() {
    this.account = { ...userAccountData };
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAccount() {
    await this.delay();
    return { ...this.account };
  }

  async getBalance() {
    await this.delay();
    return {
      balance: this.account.balance,
      lastUpdated: this.account.lastUpdated
    };
  }

  async updateBalance(amount, type = "debit") {
    await this.delay();
    
    const previousBalance = this.account.balance;
    
    if (type === "debit") {
      this.account.balance -= Math.abs(amount);
      this.account.spentToday += Math.abs(amount);
    } else {
      this.account.balance += Math.abs(amount);
    }
    
    this.account.lastUpdated = new Date().toISOString();
    
    // Simulate balance limits
    if (this.account.balance < 0) {
      this.account.balance = previousBalance;
      throw new Error("Insufficient balance");
    }
    
    if (this.account.spentToday > this.account.dailyLimit) {
      this.account.balance = previousBalance;
      this.account.spentToday -= Math.abs(amount);
      throw new Error("Daily limit exceeded");
    }
    
    return { ...this.account };
  }

  async refreshBalance() {
    await this.delay();
    
    // Simulate a small random change in balance
    const change = (Math.random() - 0.5) * 100;
    this.account.balance += change;
    this.account.lastUpdated = new Date().toISOString();
    
    return { ...this.account };
  }

  async getDailySpending() {
    await this.delay();
    return {
      spent: this.account.spentToday,
      limit: this.account.dailyLimit,
      remaining: this.account.dailyLimit - this.account.spentToday
    };
  }

  async getLinkedBanks() {
    await this.delay();
    return [...this.account.linkedBanks];
  }

  async addLinkedBank(bankData) {
    await this.delay();
    
    const newBank = {
      bankName: bankData.bankName,
      accountNumber: `****${bankData.accountNumber.slice(-4)}`,
      isPrimary: false
    };
    
    this.account.linkedBanks.push(newBank);
    return { ...this.account };
  }

  async setPrimaryBank(accountNumber) {
    await this.delay();
    
    this.account.linkedBanks.forEach(bank => {
      bank.isPrimary = bank.accountNumber === accountNumber;
    });
    
    return { ...this.account };
  }

  async updateDailyLimit(newLimit) {
    await this.delay();
    
    if (newLimit < 1000 || newLimit > 100000) {
      throw new Error("Daily limit must be between ₹1,000 and ₹1,00,000");
    }
    
    this.account.dailyLimit = newLimit;
    return { ...this.account };
  }

  async resetDailySpending() {
    await this.delay();
    this.account.spentToday = 0;
    return { ...this.account };
  }

  async validateTransaction(amount) {
    await this.delay();
    
    const errors = [];
    
    if (amount > this.account.balance) {
      errors.push("Insufficient balance");
    }
    
    if (this.account.spentToday + amount > this.account.dailyLimit) {
      errors.push("Daily limit exceeded");
    }
    
    if (amount < 1) {
      errors.push("Minimum transaction amount is ₹1");
    }
    
    if (amount > 50000) {
      errors.push("Maximum transaction amount is ₹50,000");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const userAccountService = new UserAccountService();