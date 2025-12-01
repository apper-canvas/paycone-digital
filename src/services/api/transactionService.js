import transactionsData from "@/services/mockData/transactions.json";

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getById(id) {
    await this.delay();
    return this.transactions.find(transaction => transaction.Id === parseInt(id));
  }

  async getByType(type) {
    await this.delay();
    return this.transactions
      .filter(transaction => transaction.type === type)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getByStatus(status) {
    await this.delay();
    return this.transactions
      .filter(transaction => transaction.status === status)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async searchTransactions(query) {
    await this.delay();
    const lowercaseQuery = query.toLowerCase();
    return this.transactions
      .filter(transaction => 
        transaction.recipient.toLowerCase().includes(lowercaseQuery) ||
        transaction.note.toLowerCase().includes(lowercaseQuery) ||
        transaction.category.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async create(transactionData) {
    await this.delay();
    
    const newTransaction = {
      Id: Math.max(...this.transactions.map(t => t.Id)) + 1,
      type: transactionData.type,
      amount: parseFloat(transactionData.amount),
      recipient: transactionData.recipient,
      recipientId: transactionData.recipientId,
      date: new Date().toISOString(),
      status: "completed",
      note: transactionData.note || "",
      category: transactionData.category || "transfer"
    };

    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async update(id, updateData) {
    await this.delay();
    
    const index = this.transactions.findIndex(transaction => transaction.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Transaction not found");
    }

    this.transactions[index] = { ...this.transactions[index], ...updateData };
    return this.transactions[index];
  }

  async delete(id) {
    await this.delay();
    
    const index = this.transactions.findIndex(transaction => transaction.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Transaction not found");
    }

    const deletedTransaction = this.transactions.splice(index, 1)[0];
    return deletedTransaction;
  }

  async getTotalAmount() {
    await this.delay();
    return this.transactions.reduce((total, transaction) => {
      if (transaction.status === "completed") {
        return transaction.type === "receive" 
          ? total + transaction.amount 
          : total - transaction.amount;
      }
      return total;
    }, 0);
  }

  async getMonthlyStats(year, month) {
    await this.delay();
    
    const monthlyTransactions = this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === year && 
             transactionDate.getMonth() === month &&
             transaction.status === "completed";
    });

    const sent = monthlyTransactions
      .filter(t => t.type === "send")
      .reduce((total, t) => total + t.amount, 0);
    
    const received = monthlyTransactions
      .filter(t => t.type === "receive")
      .reduce((total, t) => total + t.amount, 0);

    return { sent, received, total: received - sent };
  }
}

export const transactionService = new TransactionService();