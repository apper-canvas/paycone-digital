import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.contacts].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getById(id) {
    await this.delay();
    return this.contacts.find(contact => contact.Id === parseInt(id));
  }

  async searchContacts(query) {
    await this.delay();
    const lowercaseQuery = query.toLowerCase();
    return this.contacts
      .filter(contact => 
        contact.name.toLowerCase().includes(lowercaseQuery) ||
        contact.phone.includes(query) ||
        contact.upiId.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getFrequentContacts() {
    await this.delay();
    return [...this.contacts]
      .sort((a, b) => b.transactionCount - a.transactionCount)
      .slice(0, 5);
  }

  async create(contactData) {
    await this.delay();
    
    const newContact = {
      Id: Math.max(...this.contacts.map(c => c.Id)) + 1,
      name: contactData.name,
      phone: contactData.phone,
      upiId: contactData.upiId,
      lastTransactionAmount: 0,
      transactionCount: 0
    };

    this.contacts.push(newContact);
    return newContact;
  }

  async update(id, updateData) {
    await this.delay();
    
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }

    this.contacts[index] = { ...this.contacts[index], ...updateData };
    return this.contacts[index];
  }

  async updateTransactionStats(contactId, amount) {
    await this.delay();
    
    const contact = this.contacts.find(c => c.Id === parseInt(contactId));
    if (contact) {
      contact.lastTransactionAmount = amount;
      contact.transactionCount += 1;
    }
    return contact;
  }

  async findByPhoneOrUpi(identifier) {
    await this.delay();
    return this.contacts.find(contact => 
      contact.phone === identifier || 
      contact.upiId === identifier
    );
  }

  async delete(id) {
    await this.delay();
    
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }

    const deletedContact = this.contacts.splice(index, 1)[0];
    return deletedContact;
  }
}

export const contactService = new ContactService();