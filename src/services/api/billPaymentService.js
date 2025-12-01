import billPaymentsData from "@/services/mockData/billPayments.json";

class BillPaymentService {
  constructor() {
    this.billPayments = [...billPaymentsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.billPayments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  async getById(id) {
    await this.delay();
    return this.billPayments.find(bill => bill.Id === parseInt(id));
  }

  async getByCategory(category) {
    await this.delay();
    return this.billPayments
      .filter(bill => bill.category === category)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  async getByStatus(status) {
    await this.delay();
    return this.billPayments
      .filter(bill => bill.status === status)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  async getPendingBills() {
    await this.delay();
    return this.billPayments
      .filter(bill => bill.status === "pending")
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

async getUpcomingBills(days = 30) {
    await this.delay();
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    return this.billPayments
      .filter(bill => {
        const dueDate = new Date(bill.dueDate);
        return dueDate >= today && dueDate <= futureDate && bill.status === "pending";
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  async getBillsWithReminders() {
    await this.delay();
    const today = new Date();
    
    return this.billPayments
      .filter(bill => bill.status === "pending")
      .map(bill => {
        const dueDate = new Date(bill.dueDate);
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const isOverdue = daysUntilDue < 0;
        const isDueToday = daysUntilDue === 0;
        const isDueSoon = daysUntilDue > 0 && daysUntilDue <= 7;
        
        let urgency = 'low';
        let reminderStatus = 'none';
        
        if (isOverdue) {
          urgency = 'critical';
          reminderStatus = 'overdue';
        } else if (isDueToday) {
          urgency = 'high';
          reminderStatus = 'due-today';
        } else if (isDueSoon) {
          urgency = 'medium';
          reminderStatus = 'due-soon';
        }
        
        return {
          ...bill,
          daysUntilDue,
          isOverdue,
          isDueToday,
          isDueSoon,
          urgency,
          reminderStatus,
          reminderEnabled: true,
          reminderDays: 3,
          lastReminded: null,
          snoozedUntil: null
        };
      })
      .sort((a, b) => {
        // Sort by urgency: overdue → due today → due soon → future
        const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
  }

  async updateReminderSettings(billId, settings) {
    await this.delay();
    const billIndex = this.billPayments.findIndex(bill => bill.Id === billId);
    if (billIndex === -1) {
      throw new Error("Bill not found");
    }
    
    this.billPayments[billIndex] = {
      ...this.billPayments[billIndex],
      ...settings,
      updatedAt: new Date().toISOString()
    };
    
    return this.billPayments[billIndex];
  }

  async snoozeReminder(billId, hours = 24) {
    await this.delay();
    const snoozedUntil = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    
    return this.updateReminderSettings(billId, {
      snoozedUntil,
      lastReminded: new Date().toISOString()
    });
  }

  async dismissReminder(billId) {
    await this.delay();
    return this.updateReminderSettings(billId, {
      reminderEnabled: false,
      snoozedUntil: null,
      lastReminded: new Date().toISOString()
    });
  }

  async getActiveReminders() {
    await this.delay();
    const now = new Date();
    const bills = await this.getBillsWithReminders();
    
    return bills.filter(bill => {
      if (!bill.reminderEnabled) return false;
      if (bill.snoozedUntil && new Date(bill.snoozedUntil) > now) return false;
      
      return bill.isOverdue || bill.isDueToday || bill.isDueSoon;
    });
  }

  async getReminderStats() {
    await this.delay();
    const bills = await this.getBillsWithReminders();
    
    const stats = {
      total: bills.length,
      overdue: bills.filter(bill => bill.isOverdue).length,
      dueToday: bills.filter(bill => bill.isDueToday).length,
      dueSoon: bills.filter(bill => bill.isDueSoon).length,
      totalAmount: bills.reduce((sum, bill) => sum + bill.amount, 0),
      overdueAmount: bills.filter(bill => bill.isOverdue).reduce((sum, bill) => sum + bill.amount, 0)
    };
    
    return stats;
  }

  async create(billData) {
    await this.delay();
    
    const newBill = {
      Id: Math.max(...this.billPayments.map(b => b.Id)) + 1,
      category: billData.category,
      provider: billData.provider,
      accountNumber: billData.accountNumber,
      amount: parseFloat(billData.amount),
      dueDate: billData.dueDate,
      status: "pending"
    };

    this.billPayments.push(newBill);
    return newBill;
  }

  async payBill(id, paymentData) {
    await this.delay();
    
    const index = this.billPayments.findIndex(bill => bill.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bill not found");
    }

    this.billPayments[index] = {
      ...this.billPayments[index],
      status: "paid",
      paidDate: new Date().toISOString(),
      paidAmount: paymentData.amount || this.billPayments[index].amount
    };

    return this.billPayments[index];
  }

  async update(id, updateData) {
    await this.delay();
    
    const index = this.billPayments.findIndex(bill => bill.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bill not found");
    }

    this.billPayments[index] = { ...this.billPayments[index], ...updateData };
    return this.billPayments[index];
  }

  async delete(id) {
    await this.delay();
    
    const index = this.billPayments.findIndex(bill => bill.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bill not found");
    }

    const deletedBill = this.billPayments.splice(index, 1)[0];
    return deletedBill;
  }

  async getTotalPendingAmount() {
    await this.delay();
    return this.billPayments
      .filter(bill => bill.status === "pending")
      .reduce((total, bill) => total + bill.amount, 0);
  }

  async getCategoryStats() {
    await this.delay();
    const stats = {};
    
    this.billPayments.forEach(bill => {
      if (!stats[bill.category]) {
        stats[bill.category] = { total: 0, paid: 0, pending: 0, count: 0 };
      }
      
      stats[bill.category].total += bill.amount;
      stats[bill.category].count += 1;
      
      if (bill.status === "paid") {
        stats[bill.category].paid += bill.amount;
      } else {
        stats[bill.category].pending += bill.amount;
      }
    });
    
    return stats;
  }
}

export const billPaymentService = new BillPaymentService();